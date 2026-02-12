const db = require('./src/config/db');
const { generateQuotation } = require('./src/services/quotationService');

async function testDay17() {
    try {
        console.log('--- STARTING DAY 17 VERIFICATION ---');

        // 1. Seed Quotation Test Car
        console.log('Seeding test car...');
        await db.query(`DELETE FROM cars WHERE model LIKE 'TEST_PRICE_%'`);

        // Base Price: 20L
        // Year: 2022 (Current 2026? Wait, system time says 2026-02-11)
        // Age: 2026 - 2022 = 4 years -> 15% Depreciation (0.15)
        // Mileage: 40000 -> 0.95 Factor (<60k)
        // Score: Assuming 100 (if perfect match) -> 1.05 Demand Factor

        // Expected Calc:
        // Base: 20,00,000
        // Depreciated: 20L * (1 - 0.15) = 17,00,000
        // Mileage Adj: 17L * 0.95 = 16,15,000
        // Demand Adj: 16.15L * 1.05 = 16,95,750
        // Final: 16,95,750 (Round to 100 -> 16,95,800)

        const testCar = ['Toyota', 'TEST_PRICE_Fortuner', 2022, 'Diesel', 40000, 2000000, 'Used', 'SUV', 12.0];

        await db.query(
            `INSERT INTO cars (brand, model, year, fuel_type, mileage, base_price, condition, body_type, fuel_efficiency) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            testCar
        );

        // 2. Create Requirement for Perfect Match
        // Budget 25L, Usage FAMILY (SUV), Mileage Low/Medium
        const reqResult = await db.query(`
            INSERT INTO customer_requirements (customer_id, budget, usage_type, mileage_priority, maintenance_priority)
            VALUES (1, 2500000, 'FAMILY', 'Medium', 'Low')
            RETURNING id
        `);
        const reqId = reqResult.rows[0].id;

        // 3. Generate Quotation
        console.log('Generating Quotation...');
        const result = await generateQuotation(reqId);

        if (result.status === 'success') {
            const { quotation } = result;
            console.log('\n--- QUOTATION RESULT ---');
            console.log(`Car: ${quotation.car.brand} ${quotation.car.model}`);
            console.log(`Base Price: ${quotation.pricing.breakdown.base_price}`);
            console.log(`Final Price: ${quotation.pricing.final_price}`);
            console.log(`Breakdown:`, quotation.pricing.breakdown);

            // Verification
            // Age is calculated as currentYear - carYear. 
            // process.env.TZ might affect Date, let's see. 
            // logic: new Date().getFullYear().
            const currentYear = new Date().getFullYear();
            const age = currentYear - 2022; // likely 4 or 3 depending on system year. Prompt said 2026.
            // If 2026, Age 4. -> 15% dep.

            const expectedDepPercent = 0.15; // 4-5 yrs
            const expectedMileageFactor = 0.95; // 30-60k

            if (quotation.pricing.breakdown.depreciation_percent === expectedDepPercent) {
                console.log('✅ PASS: Depreciation Correct (15% for 4 year old car)');
            } else {
                console.log(`❌ FAIL: Depreciation Expected ${expectedDepPercent}, Got ${quotation.pricing.breakdown.depreciation_percent} (Age: ${quotation.pricing.breakdown.age})`);
            }

            if (quotation.pricing.final_price > 0) {
                console.log('✅ PASS: Final price calculated');
            }

        } else {
            console.log('❌ FAIL: Quotation generation failed');
            console.log(result);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        setTimeout(() => process.exit(0), 1000);
    }
}

testDay17();
