const db = require('./src/config/db');

async function updateSchema() {
    try {
        console.log('Checking if body_type column exists...');

        // Check if column exists
        const checkQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='cars' AND column_name='body_type';
    `;

        const { rows } = await db.query(checkQuery);

        if (rows.length === 0) {
            console.log('Adding body_type column to cars table...');
            await db.query(`ALTER TABLE cars ADD COLUMN body_type VARCHAR(50);`);
            console.log('✅ Column added successfully.');

            // Update existing cars with default body_type
            console.log('Updating existing cars...');
            await db.query(`UPDATE cars SET body_type = 'MUV' WHERE model LIKE '%Innova%';`);
            await db.query(`UPDATE cars SET body_type = 'SUV' WHERE model LIKE '%Creta%' OR model LIKE '%Seltos%' OR model LIKE '%XUV%';`);
            await db.query(`UPDATE cars SET body_type = 'Sedan' WHERE model LIKE '%City%' OR model LIKE '%Verna%';`);
            await db.query(`UPDATE cars SET body_type = 'Hatchback' WHERE model LIKE '%Swift%' OR model LIKE '%Baleno%' OR model LIKE '%i20%';`);

            console.log('✅ Existing cars updated.');
        } else {
            console.log('ℹ️ Column body_type already exists.');
        }

    } catch (error) {
        console.error('❌ Database error:', error);
    } finally {
        setTimeout(() => process.exit(0), 500);
    }
}

updateSchema();
