// ==========================================================
// 🔐 Create Admin User Script
// ==========================================================
// Run this script to create an admin user with properly hashed password
// Usage: node createAdmin.js

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

const createAdmin = async () => {
    try {
        const email = 'admin@system.com';
        const password = 'admin123';

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert admin into database
        const result = await pool.query(
            'INSERT INTO admin (email, password) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING *',
            [email, hashedPassword]
        );

        if (result.rows.length > 0) {
            console.log('✅ Admin user created successfully!');
            console.log('📧 Email:', email);
            console.log('🔑 Password:', password);
            console.log('\n⚠️  Please change this password in production!');
        } else {
            console.log('ℹ️  Admin user already exists with email:', email);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
