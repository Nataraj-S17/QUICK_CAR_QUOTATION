const db = require('./src/config/db');

async function addFuelEfficiency() {
    try {
        console.log('Checking if fuel_efficiency column exists...');

        const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='cars' AND column_name='fuel_efficiency';
    `;

        const { rows } = await db.query(checkQuery);

        if (rows.length === 0) {
            console.log('Adding fuel_efficiency column to cars table...');
            await db.query(`ALTER TABLE cars ADD COLUMN fuel_efficiency DECIMAL(5, 2) DEFAULT 15.0;`);
            console.log('✅ Column added successfully.');

            // Update existing cars with realistic mileage for testing
            console.log('Updating existing cars...');
            // Diesels ~14-16, Petrols ~15-20, CNG ~25
            await db.query(`UPDATE cars SET fuel_efficiency = 14.0 WHERE fuel_type = 'Diesel';`);
            await db.query(`UPDATE cars SET fuel_efficiency = 18.0 WHERE fuel_type = 'Petrol';`);
            await db.query(`UPDATE cars SET fuel_efficiency = 22.0 WHERE fuel_type = 'CNG' OR fuel_type = 'Hybrid';`);

            // Specific overrides for accuracy
            await db.query(`UPDATE cars SET fuel_efficiency = 12.0 WHERE model LIKE '%Innova%';`); // Heavy MPV
            await db.query(`UPDATE cars SET fuel_efficiency = 20.0 WHERE model LIKE '%Swift%' OR model LIKE '%Alto%';`); // Efficient Hatch

            console.log('✅ Existing cars updated.');
        } else {
            console.log('ℹ️ Column fuel_efficiency already exists.');
        }

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        setTimeout(() => process.exit(0), 500);
    }
}

addFuelEfficiency();
