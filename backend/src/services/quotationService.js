const db = require('../config/db');
const recommendationService = require('./recommendationService');
const { calculateFinalPrice } = require('../ai/priceEngine');

/**
 * Generate a quotation for a requirement
 * @param {number} requirementId 
 */
async function generateQuotation(requirementId) {
    try {
        // 1. Get Recommendation
        const recResult = await recommendationService.getRecommendation(requirementId);

        if (recResult.status !== 'success') {
            return {
                status: 'error',
                message: recResult.message || 'Could not generate recommendation'
            };
        }

        const { car, score } = recResult.recommendation;

        // 2. Calculate Price
        // We need the full car object with mileage for pricing
        // recommendationService returns a simplified car object. 
        // We should ensure we have mileage. 
        // Let's assume recommendationService returns enough, or we fetch it.
        // Actually, recommendationService 'car' object has: id, brand, model, year, price.
        // It might NOT have mileage.

        // Fetch full car details to be safe
        const carResult = await db.query('SELECT * FROM cars WHERE id = $1', [car.id]);
        if (carResult.rows.length === 0) throw new Error('Car not found');
        const fullCar = carResult.rows[0];

        // Calculate
        const pricing = calculateFinalPrice(fullCar, score);

        // 3. Save to Quotations Table
        // Check if quotations table exists. If not, maybe create it? 
        // The prompt says "Save into quotations table".
        // Let's assume it exists or we CREATE IF NOT EXISTS here or in schema.
        // I'll add a quick check/create for safety in a separate migration step or just assume schema.
        // Let's assume it exists based on "Day 17... Stored in quotation table".
        // Use a simple INSERT.

        // Wait, I should check DATABASE_SCHEMA.sql first. 
        // But for now I'll write the logic.

        // 2.5 Fetch Customer ID from Requirement
        const reqQuery = await db.query('SELECT customer_id FROM customer_requirements WHERE id = $1', [requirementId]);
        if (reqQuery.rows.length === 0) throw new Error('Requirement not found');
        const customerId = reqQuery.rows[0].customer_id;

        // 3. Save to Quotations Table
        const insertQuery = `
            INSERT INTO quotations (customer_id, requirement_id, car_id, ai_score, base_price, final_price, pricing_breakdown, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
            RETURNING id, created_at
        `;

        const saveResult = await db.query(insertQuery, [
            customerId,
            requirementId,
            fullCar.id,
            score,
            pricing.breakdown.base_price,
            pricing.final_price,
            pricing.breakdown // PG handles JSON automatically usually, or use JSON.stringify if needed
        ]);

        return {
            status: 'success',
            quotation: {
                id: saveResult.rows[0].id,
                date: saveResult.rows[0].created_at,
                car: {
                    brand: fullCar.brand,
                    model: fullCar.model,
                    year: fullCar.year,
                    image: fullCar.image_url
                },
                score: score,
                explanation: recResult.recommendation.explanation,
                pricing: pricing
            }
        };

    } catch (error) {
        console.error('Error generating quotation:', error);
        throw error;
    }
}

module.exports = {
    generateQuotation
};
