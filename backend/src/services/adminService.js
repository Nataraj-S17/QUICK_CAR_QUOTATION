const pool = require('../config/db');

/**
 * Service to handle Admin related database operations
 */
const adminService = {
  /**
   * Create a new car in the database
   * @param {Object} carData - The car details
   * @returns {Object} The created car
   */
  createCar: async (carData) => {
    const { brand, model, year, fuel_type, mileage, base_price, condition } = carData;

    const query = `
      INSERT INTO cars (brand, model, year, fuel_type, mileage, base_price, condition, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING *;
    `;

    const values = [brand, model, year, fuel_type, mileage, base_price, condition];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Update car by ID
   * @param {number} id - Car ID
   * @param {Object} fields - Fields to update
   * @returns {Object|null} Updated car or null if not found
   */
  updateCarById: async (id, fields) => {
    const keys = Object.keys(fields);
    if (keys.length === 0) return null;

    // Dynamic SQL generation
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    const values = [id, ...Object.values(fields)];

    const query = `
      UPDATE cars
      SET ${setClause}
      WHERE id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  /**
   * Soft delete car by ID
   * @param {number} id - Car ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteCarById: async (id) => {
    const query = `
      UPDATE cars
      SET is_active = false
      WHERE id = $1
      RETURNING id;
    `;

    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }
};

module.exports = adminService;
