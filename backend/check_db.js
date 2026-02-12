const db = require('./src/config/db');

async function checkDatabase() {
    try {
        console.log('Checking customer_requirements table...');
        const result = await db.query('SELECT * FROM customer_requirements LIMIT 5');
        const rows = result.rows;
        console.log('Found ' + rows.length + ' requirements:');

        if (rows.length > 0) {
            console.log(JSON.stringify(rows[0], null, 2));
        }

        if (rows.length === 0) {
            console.log('Inserting sample requirement...');
            // Insert a sample requirement if none exists
            // Assuming customer_id 1 exists from sample data SQL
            try {
                const insertResult = await db.query(`
            INSERT INTO customer_requirements (customer_id, budget, usage_type, mileage_priority, maintenance_priority)
            VALUES (1, 600000, 'FAMILY', 'HIGH', 'LOW')
            RETURNING id
          `);
                console.log('Inserted requirement with ID:', insertResult.rows[0].id);
            } catch (insertError) {
                console.error('Error inserting requirement:', insertError.message);
                if (insertError.message.includes('violates foreign key constraint')) {
                    console.log('Creating customer 1...');
                    await db.query(`
                INSERT INTO customers (id, name, phone, email, password)
                VALUES (1, 'Test User', '1234567890', 'test@example.com', 'password')
                ON CONFLICT (id) DO NOTHING
              `);

                    // Try inserting requirement again
                    const retryResult = await db.query(`
                INSERT INTO customer_requirements (customer_id, budget, usage_type, mileage_priority, maintenance_priority)
                VALUES (1, 600000, 'FAMILY', 'HIGH', 'LOW')
                RETURNING id
              `);
                    console.log('Inserted requirement with ID:', retryResult.rows[0].id);
                }
            }
        }
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        // We need to end the pool to exit the process cleanly
        // But since the pool is exported directly, we might not have an end method exposed cleanly or it might hang
        // We'll just force exit
        setTimeout(() => process.exit(0), 500);
    }
}

checkDatabase();
