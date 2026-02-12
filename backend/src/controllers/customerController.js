const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const requirementService = require('../services/requirementService');

/**
 * Customer Registration Controller
 * Handles POST /api/customer/register
 */
exports.register = async (req, res) => {
    const { name, phone, email, password } = req.body;

    // 1. Validate Input - All fields required
    if (!name || !phone || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required (name, phone, email, password)'
        });
    }

    try {
        // 2. Check if email already exists
        const checkEmailQuery = 'SELECT * FROM customers WHERE email = $1';
        const existingCustomer = await pool.query(checkEmailQuery, [email]);

        if (existingCustomer.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // 3. Hash password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Insert new customer into database
        const insertCustomerQuery = `
            INSERT INTO customers (name, phone, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, phone, email, created_at
        `;

        const result = await pool.query(insertCustomerQuery, [
            name,
            phone,
            email,
            hashedPassword
        ]);

        // 5. Success Response
        res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            customer: result.rows[0]
        });

    } catch (err) {
        console.error('Registration Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

/**
 * Customer Login Controller
 * Handles POST /api/customer/login
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // 1. Validate Input - All fields required
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    try {
        // 2. Find customer by email
        const findCustomerQuery = 'SELECT * FROM customers WHERE email = $1';
        const result = await pool.query(findCustomerQuery, [email]);

        // 3. Check if customer exists
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        const customer = result.rows[0];

        // 4. Compare password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, customer.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // 5. Generate JWT Token
        const token = jwt.sign(
            {
                id: customer.id,
                email: customer.email,
                role: 'customer'
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 6. Success Response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                role: 'customer'
            }
        });

    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * Save Customer Requirements
 * Handles POST /api/customer/requirements
 */
exports.saveRequirement = async (req, res) => {
    try {
        const { budget, usage_type, mileage_priority, maintenance_priority } = req.body;
        const customerId = req.user.id;

        // 1. Validation
        if (!budget || !usage_type || !mileage_priority || !maintenance_priority) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (budget, usage_type, mileage_priority, maintenance_priority)'
            });
        }

        if (isNaN(budget)) {
            return res.status(400).json({
                success: false,
                message: 'Budget must be a number'
            });
        }

        // 2. Call Service to save requirement
        const newRequirement = await requirementService.createRequirement(customerId, {
            budget,
            usage_type,
            mileage_priority,
            maintenance_priority
        });

        // 3. Success Response
        return res.status(201).json({
            success: true,
            message: 'Requirements saved successfully',
            data: newRequirement
        });

    } catch (err) {
        console.error('Error saving requirements:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error while saving requirements'
        });
    }
};
