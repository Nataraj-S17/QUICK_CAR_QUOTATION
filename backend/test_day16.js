const db = require('./src/config/db');
const { getRecommendation } = require('./src/services/recommendationService');

async function testDay16() {
    try {
        console.log('--- STARTING DAY 16 VERIFICATION ---');

        // 1. Seed Test Cars (Create a tie to test selection logic)
        console.log('Seeding test cars...');
        await db.query(`DELETE FROM cars WHERE model LIKE 'TEST_REC_%'`);

        const testCars = [
            // Car A: High Score (90), High Price (10L)
            ['Honda', 'TEST_REC_City_High_Price', 2021, 'Petrol', 30000, 1000000, 'Used', 'Sedan', 18.0],
            // Car B: High Score (90), Low Price (9L) -> Should Win Tie
            ['Honda', 'TEST_REC_City_Low_Price', 2021, 'Petrol', 30000, 900000, 'Used', 'Sedan', 18.0],
            // Car C: Low Score
            ['Tata', 'TEST_REC_Nano', 2015, 'Petrol', 50000, 100000, 'Used', 'Hatchback', 20.0]
        ];

        for (const car of testCars) {
            await db.query(
                `INSERT INTO cars (brand, model, year, fuel_type, mileage, base_price, condition, body_type, fuel_efficiency) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                car
            );
        }

        // 2. Create Requirement matching Honda City (Sedan/City)
        // Budget 12L, Usage CITY (Sedan gets +10, Hatchback +20 usually, wait. Usage rules differ)
        // Let's use BUSINESS to give Sedan +20.
        // Budget 12L.
        const reqResult = await db.query(`
            INSERT INTO customer_requirements (customer_id, budget, usage_type, mileage_priority, maintenance_priority)
            VALUES (1, 1200000, 'BUSINESS', 'Medium', 'Low')
            RETURNING id
        `);
        const reqId = reqResult.rows[0].id;

        // 3. Get Recommendation
        console.log('Requesting Recommendation...');
        const result = await getRecommendation(reqId);

        if (result.status === 'success') {
            const { car, score, explanation } = result.recommendation;
            console.log('\n--- RECOMMENDATION RESULT ---');
            console.log(`Selected Car: ${car.brand} ${car.model}`);
            console.log(`Score: ${score}`);
            console.log(`Price: ${car.price}`);
            console.log(`Explanation: "${explanation}"`);

            // Verification 1: Tie Breaking
            if (car.model === 'TEST_REC_City_Low_Price') {
                console.log('✅ PASS: Tie-breaking Logic (Lower Price selected)');
            } else {
                console.log('❌ FAIL: Tie-breaking selected wrong car');
            }

            // Verification 2: Explanation Content
            if (explanation.includes('fits within your budget') &&
                explanation.includes('excellent fuel efficiency') &&
                explanation.includes('premium styling')) {
                console.log('✅ PASS: Explanation contains expected phrases');
            } else {
                console.log('❌ FAIL: Explanation missing key phrases');
            }

        } else {
            console.log('❌ FAIL: No recommendation returned');
            console.log(result);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        setTimeout(() => process.exit(0), 1000);
    }
}

testDay16();
