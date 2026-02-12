const pool = require('../config/db');
const bcrypt = require('bcrypt');

const createAdminTable = async () => {
    const userCreateQuery = `
    CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    try {
        await pool.query(userCreateQuery);
        console.log('Admin table created (or already exists).');
    } catch (err) {
        console.error('Error creating admin table:', err);
        throw err;
    }
};

const seedAdmin = async () => {
    const email = 'admin@example.com';
    const plainPassword = 'admin123';

    try {
        // Check if admin exists
        const checkRes = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
        if (checkRes.rows.length > 0) {
            console.log('Admin already exists.');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        // Insert admin
        const insertQuery = 'INSERT INTO admin (email, password) VALUES ($1, $2)';
        await pool.query(insertQuery, [email, hashedPassword]);
        console.log(`Admin created: ${email} / ${plainPassword}`);
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
};

const createCustomersTable = async () => {
    const customerCreateQuery = `
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    try {
        await pool.query(customerCreateQuery);
        console.log('Customers table created (or already exists).');
    } catch (err) {
        console.error('Error creating customers table:', err);
        throw err;
    }
};

const init = async () => {
    try {
        await createAdminTable();
        await seedAdmin();
        await createCustomersTable();
    } catch (err) {
        console.error('Initialization failed:', err);
    } finally {
        pool.end();
    }
};

init();
