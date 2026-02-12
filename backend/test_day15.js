const db = require('./src/config/db');
const { scoreAndRankCars } = require('./src/services/aiService');

async function testDay15() {
    try {
        console.log('--- STARTING DAY 15 VERIFICATION ---');

        // 1. Seed Test Cars
        console.log('Seeding test cars...');
        await db.query(`DELETE FROM cars WHERE model LIKE 'TEST_AI_%'`); // Cleanup prev runs

        const testCars = [
            // Car A: Perfect Match for "Family" (SUV, Good Year, Reasonable Price) -- Innova 14.5 (Passes Medium 14 threshold)
            ['Toyota', 'TEST_AI_Innova', 2021, 'Diesel', 60000, 1500000, 'Used', 'SUV', 14.5],
            // Car B: Good Mileage but Small (Hatchback) -- Swift 21.0
            ['Maruti', 'TEST_AI_Swift', 2022, 'Petrol', 30000, 700000, 'Used', 'Hatchback', 21.0],
            // Car C: Luxury but Expensive -- BMW 10.0 (Fails Medium 14 threshold)
            ['BMW', 'TEST_AI_3Series', 2019, 'Petrol', 40000, 3500000, 'Used', 'Sedan', 10.0]
        ];

        for (const car of testCars) {
            await db.query(
                `INSERT INTO cars (brand, model, year, fuel_type, mileage, base_price, condition, body_type, fuel_efficiency) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                car
            );
        }
        console.log('✅ Seeded 3 test cars.');

        // 2. Ensure Requirement Exists (Family usage, Budget covers Innova)
        console.log('Ensuring customer requirement...');
        // Let's create a requirement: Budget 16L, Family use, Medium Mileage Priority
        // Medium Mileage Priority -> Min Mileage 14
        const reqResult = await db.query(`
            INSERT INTO customer_requirements (customer_id, budget, usage_type, mileage_priority, maintenance_priority)
            VALUES (1, 1600000, 'FAMILY', 'Medium', 'Low')
            RETURNING id
        `);
        const reqId = reqResult.rows[0].id;
        console.log(`✅ Created test requirement ID: ${reqId}`);

        // 3. Run Scoring Engine
        console.log('Running AI Scoring...');
        const result = await scoreAndRankCars(reqId);

        // 4. Verify Results
        console.log('\n--- RANKING RESULTS ---');
        result.ranked_cars
            .filter(c => c.model.includes('TEST_AI'))
            .forEach((c, i) => {
                console.log(`#${i + 1}: ${c.brand} ${c.model} (${c.body_type}) - Score: ${c.ai_score}`);
                console.log(`    Budget: ${c.match_details.budget_score.score} | Mileage: ${c.match_details.mileage_score.score} | Usage: ${c.match_details.usage_score.score}`);
            });

        // Expected Winner: Innova
        const winner = result.ranked_cars.find(c => c.model.includes('TEST_AI'));
        if (winner.model === 'TEST_AI_Innova') {
            console.log('\n✅ TEST PASSED: Innova is ranked #1 (Perfect Family Match)');
        } else {
            console.log(`\n❌ TEST FAILED: Expected Innova to win, but got ${winner.model}`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        setTimeout(() => process.exit(0), 1000);
    }
}

testDay15();
