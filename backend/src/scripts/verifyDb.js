const pool = require('../config/db');

const verifyDatabase = async () => {
    try {
        console.log('🔍 Starting Database Verification...\n');

        // 1. Verify Admin
        console.log('--- 1. Checking ADMIN table ---');
        const adminRes = await pool.query('SELECT id, email, created_at FROM admin');
        console.table(adminRes.rows);

        // 2. Verify Customers
        console.log('\n--- 2. Checking CUSTOMERS table ---');
        const custRes = await pool.query('SELECT id, name, email, phone FROM customers');
        console.table(custRes.rows);

        // 3. Verify Cars
        console.log('\n--- 3. Checking CARS table ---');
        const carRes = await pool.query('SELECT id, brand, model, year, base_price, condition FROM cars');
        console.table(carRes.rows);

        // 4. Verify Customer Requirements
        console.log('\n--- 4. Checking CUSTOMER_REQUIREMENTS table ---');
        const reqRes = await pool.query('SELECT id, customer_id, budget, usage_type FROM customer_requirements');
        console.table(reqRes.rows);

        // 5. Verify Quotations (Foreign Key Test)
        console.log('\n--- 5. Verifying Relationships (Quotations JOIN) ---');
        const joinQuery = `
            SELECT 
                q.id as quote_id,
                c.name as customer,
                car.brand || ' ' || car.model as car,
                q.ai_score,
                q.final_price,
                q.status
            FROM quotations q
            JOIN customers c ON q.customer_id = c.id
            JOIN cars car ON q.car_id = car.id
            JOIN customer_requirements req ON q.requirement_id = req.id;
        `;
        const quoteRes = await pool.query(joinQuery);

        if (quoteRes.rows.length > 0) {
            console.table(quoteRes.rows);
            console.log('\n✅ TEST PASSED: Foreign key relationships are working correctly.');
        } else {
            console.log('\n❌ TEST FAILED: No linked data found in Quotations.');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Verification Error:', err);
        process.exit(1);
    }
};

verifyDatabase();
