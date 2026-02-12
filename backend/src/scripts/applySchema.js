const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const applySchema = async () => {
    try {
        const schemaPath = path.join(__dirname, '../../DATABASE_SCHEMA.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying database schema...');
        
        // Execute the SQL file
        await pool.query(schemaSql);
        
        console.log('✅ Database schema applied successfully!');
        console.log('✅ Tables created: admin, customers, cars, customer_requirements, quotations');
        console.log('✅ Sample data inserted (if not exists)');
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Error applying schema:', err);
        process.exit(1);
    }
};

applySchema();
