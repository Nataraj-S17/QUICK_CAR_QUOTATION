// Check existing admin credentials
require('dotenv').config();
const pool = require('../src/config/db');

const checkAdmin = async () => {
    try {
        const result = await pool.query('SELECT id, email, created_at FROM admin');
        console.log('📋 Admin users in database:', result.rows);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

checkAdmin();
