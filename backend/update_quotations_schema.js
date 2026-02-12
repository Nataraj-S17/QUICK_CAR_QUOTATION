const db = require('./src/config/db');

async function updateQuotationsSchema() {
    try {
        console.log('Updating quotations table schema...');

        // Add base_price
        await db.query(`
            ALTER TABLE quotations 
            ADD COLUMN IF NOT EXISTS base_price DECIMAL(12, 2)
        `);
        console.log('✅ Added base_price column.');

        // Add pricing_breakdown
        await db.query(`
            ALTER TABLE quotations 
            ADD COLUMN IF NOT EXISTS pricing_breakdown JSONB
        `);
        console.log('✅ Added pricing_breakdown column.');

    } catch (error) {
        console.error('❌ Error updating schema:', error);
    } finally {
        process.exit();
    }
}

updateQuotationsSchema();
