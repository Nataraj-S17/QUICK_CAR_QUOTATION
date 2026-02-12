const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminService = require('../services/adminService');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // 1. Validate Input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // 2. Check if admin exists
        const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const admin = result.rows[0];

        // STRICT SECURITY: Only allow specific admin email
        if (admin.email !== 'admin@gmail.com') {
            return res.status(403).json({ message: 'Access Denied: Not the authorized admin.' });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 4. Generate Token
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 5. Response
        res.json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                role: 'admin'
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Add a new car (Admin only)
 */
exports.addCar = async (req, res) => {
    try {
        const { brand, model, year, fuel_type, mileage, base_price, condition } = req.body;

        // 1. Validation
        if (!brand || !model || !year || !fuel_type || !mileage || !base_price || !condition) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate numeric fields
        if (isNaN(year) || isNaN(mileage) || isNaN(base_price)) {
            return res.status(400).json({
                success: false,
                message: 'Year, mileage, and base_price must be valid numbers'
            });
        }

        // 2. Call Service
        const newCar = await adminService.createCar({
            brand,
            model,
            year: parseInt(year),
            fuel_type,
            mileage: parseInt(mileage),
            base_price: parseFloat(base_price),
            condition
        });

        // 3. Response
        res.status(201).json({
            success: true,
            message: 'Car added successfully',
            car: newCar
        });

    } catch (err) {
        console.error('Add Car Error:', err);
        res.status(500).json({
            success: false,
            message: 'Error adding car: ' + err.message
        });
    }
};

/**
 * Update car details (Admin only)
 */
exports.updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields provided for update'
            });
        }

        const updatedCar = await adminService.updateCarById(id, updates);

        if (!updatedCar) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        res.json({
            success: true,
            message: 'Car updated successfully',
            car: updatedCar
        });
    } catch (err) {
        console.error('Update Car Error:', err);
        res.status(500).json({
            success: false,
            message: 'Error updating car'
        });
    }
};

/**
 * Delete (Soft Delete) car (Admin only)
 */
exports.deleteCar = async (req, res) => {
    try {
        const { id } = req.params;

        const isDeleted = await adminService.deleteCarById(id);

        if (!isDeleted) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        res.json({
            success: true,
            message: 'Car deleted successfully'
        });
    } catch (err) {
        console.error('Delete Car Error:', err);
        res.status(500).json({
            success: false,
            message: 'Error deleting car'
        });
    }
};
