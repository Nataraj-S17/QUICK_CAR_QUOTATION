const db = require('../config/db');
const { interpretRequirement } = require('../ai/requirementInterpreter');
const { scoreCar, rankCars } = require('../ai/scoringEngine');

/**
 * AI Service Layer
 * Handles business logic for AI requirement interpretation
 */

/**
 * Fetches customer requirement and interprets it using AI
 * @param {number} requirementId - ID of the customer requirement
 * @returns {Promise<object>} - Structured AI interpretation
 */
async function interpretCustomerRequirement(requirementId) {
    try {
        // Validate input
        if (!requirementId || isNaN(requirementId)) {
            throw new Error('Valid requirement ID is required');
        }

        // Fetch customer requirement from database
        const query = `
      SELECT 
        id,
        customer_id,
        budget,
        usage_type,
        mileage_priority,
        maintenance_priority,
        created_at
      FROM customer_requirements
      WHERE id = $1
    `;

        const { rows } = await db.query(query, [requirementId]);

        // Check if requirement exists
        if (!rows || rows.length === 0) {
            throw new Error(`Requirement with ID ${requirementId} not found`);
        }

        const requirementData = rows[0];

        // Apply AI interpretation
        const aiInterpretation = interpretRequirement({
            budget: requirementData.budget,
            usage_type: requirementData.usage_type,
            mileage_priority: requirementData.mileage_priority,
            maintenance_priority: requirementData.maintenance_priority
        });

        // Add original requirement metadata
        aiInterpretation.requirement_id = requirementData.id;
        aiInterpretation.customer_id = requirementData.customer_id;
        aiInterpretation.original_created_at = requirementData.created_at;

        return aiInterpretation;
    } catch (error) {
        console.error('Error in interpretCustomerRequirement:', error);
        throw error;
    }
}

/**
 * Score and rank cars based on a requirement
 * @param {number} requirementId 
 * @returns {Promise<Array>} - List of cars sorted by AI score
 */
async function scoreAndRankCars(requirementId) {
    try {
        // 1. Get Interpreted Requirement
        const aiRequirement = await interpretCustomerRequirement(requirementId);

        // 2. Fetch Active Cars
        // Ensure we fetch all necessary columns including the new body_type
        const carsQuery = `
            SELECT id, brand, model, year, fuel_type, mileage, base_price, condition, body_type, fuel_efficiency, is_active 
            FROM cars
            WHERE is_active = TRUE
        `;
        const { rows: cars } = await db.query(carsQuery);

        if (!cars || cars.length === 0) {
            return [];
        }

        // 3. Score Each Car
        const scoredCars = cars.map(car => scoreCar(car, aiRequirement));

        // 4. Rank Cars (Sort Descending)
        const rankedCars = rankCars(scoredCars);

        return {
            requirement: aiRequirement,
            ranked_cars: rankedCars
        };

    } catch (error) {
        console.error('Error in scoreAndRankCars:', error);
        throw error;
    }
}

/**
 * Batch interpret multiple requirements
 * @param {Array<number>} requirementIds - Array of requirement IDs
 * @returns {Promise<Array<object>>} - Array of AI interpretations
 */
async function batchInterpretRequirements(requirementIds) {
    try {
        if (!Array.isArray(requirementIds) || requirementIds.length === 0) {
            throw new Error('Valid array of requirement IDs is required');
        }

        const interpretations = await Promise.all(
            requirementIds.map(id => interpretCustomerRequirement(id))
        );

        return interpretations;
    } catch (error) {
        console.error('Error in batchInterpretRequirements:', error);
        throw error;
    }
}

/**
 * Get all requirements for a customer and interpret them
 * @param {number} customerId - Customer ID
 * @returns {Promise<Array<object>>} - Array of AI interpretations
 */
async function interpretAllCustomerRequirements(customerId) {
    try {
        if (!customerId || isNaN(customerId)) {
            throw new Error('Valid customer ID is required');
        }

        // Fetch all requirements for the customer
        const query = `
      SELECT id
      FROM customer_requirements
      WHERE customer_id = $1
      ORDER BY created_at DESC
    `;

        const { rows } = await db.query(query, [customerId]);

        if (!rows || rows.length === 0) {
            return [];
        }

        const requirementIds = rows.map(row => row.id);
        return await batchInterpretRequirements(requirementIds);
    } catch (error) {
        console.error('Error in interpretAllCustomerRequirements:', error);
        throw error;
    }
}

module.exports = {
    interpretCustomerRequirement,
    scoreAndRankCars,
    batchInterpretRequirements,
    interpretAllCustomerRequirements
};
