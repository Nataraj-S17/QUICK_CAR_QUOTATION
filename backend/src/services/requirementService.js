const pool = require('../config/db');

/**
 * Requirement Service
 * Handles business logic for customer requirements
 */

/**
 * Create a new requirement for a customer
 * @param {number} customerId - The ID of the authenticated customer
 * @param {Object} data - Requirement data (budget, usage_type, mileage_priority, maintenance_priority)
 * @returns {Object} - The created requirement
 */
exports.createRequirement = async (customerId, data) => {
    const { budget, usage_type, mileage_priority, maintenance_priority } = data;

    const query = `
        INSERT INTO customer_requirements 
        (customer_id, budget, usage_type, mileage_priority, maintenance_priority)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;

    const values = [
        customerId,
        budget,
        usage_type,
        mileage_priority,
        maintenance_priority
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};
