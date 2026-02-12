const pool = require('../config/db');

/**
 * Service to handle Car related database operations
 */
const carService = {
    /**
     * Fetch cars with optional filters
     * @param {Object} filters - Filter criteria (min_price, max_price, fuel_type, min_mileage)
     * @returns {Array} List of cars
     */
    fetchCarsWithFilters: async (filters) => {
        const { min_price, max_price, fuel_type, min_mileage } = filters;

        let query = 'SELECT * FROM cars WHERE is_active = true';
        const values = [];
        let paramIndex = 1;

        // Dynamic Query Building
        if (min_price) {
            query += ` AND base_price >= $${paramIndex}`;
            values.push(min_price);
            paramIndex++;
        }

        if (max_price) {
            query += ` AND base_price <= $${paramIndex}`;
            values.push(max_price);
            paramIndex++;
        }

        if (fuel_type) {
            query += ` AND fuel_type = $${paramIndex}`;
            values.push(fuel_type);
            paramIndex++;
        }

        if (min_mileage) {
            query += ` AND mileage <= $${paramIndex}`; // Usually users want lower mileage, but req says "min_mileage" filter. 
            // Context Check: "min_mileage" usually matches cars with AT LEAST this mileage? 
            // Or does it mean "mileage filter"? 
            // User Req says: "min_mileage". 
            // A common use case is "Low Mileage" filter.
            // However, if the param is named "min_mileage", it conventionally means "mileage >= X".
            // Let's stick to the literal name "min_mileage" => mileage >= values.
            // Wait, logically for second hand cars, people filter for "Max Mileage".
            // If the requirement explicitly asked for "min_mileage", I will implement it as >=.
            // But typically "min" and "max" filters work as bounds.
            query += ` AND mileage >= $${paramIndex}`;
            values.push(min_mileage);
            paramIndex++;
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, values);
        return result.rows;
    }
};

module.exports = carService;
