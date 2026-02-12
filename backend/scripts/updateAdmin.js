// Update admin password with properly hashed one
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

const updateAdmin = async () => {
    try {
        const email = 'admin@example.com';
        const newPassword = 'admin123';

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update admin password
        const result = await pool.query(
            'UPDATE admin SET password = $1 WHERE email = $2 RETURNING email',
            [hashedPassword, email]
        );

        if (result.rows.length > 0) {
            console.log('✅ Admin password updated successfully!');
            console.log('📧 Email:', email);
            console.log('🔑 Password:', newPassword);
            console.log('\n💡 You can now login with these credentials!');
        } else {
            console.log('❌ Admin not found');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

updateAdmin();
