const pool = require('../src/config/db');
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
    try {
        const email = 'admin@gmail.com';
        const password = 'admin@123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin table exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admin (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Check if admin exists
        const res = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);

        if (res.rows.length > 0) {
            console.log('Admin already exists. Updating password...');
            await pool.query('UPDATE admin SET password = $1 WHERE email = $2', [hashedPassword, email]);
        } else {
            console.log('Creating new admin...');
            await pool.query('INSERT INTO admin (email, password) VALUES ($1, $2)', [email, hashedPassword]);
        }

        console.log('Admin seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
