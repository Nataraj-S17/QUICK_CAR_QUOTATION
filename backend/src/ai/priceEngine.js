/**
 * AI Price Calculation Engine
 * 
 * Calculates the final quotation price based on:
 * 1. Base Price
 * 2. Depreciation (Age-based)
 * 3. Mileage Factor (Wear & Tear)
 * 4. Demand Factor (AI Score)
 */

/**
 * Calculates the final price for a car
 * @param {object} car - Car object { year, mileage, base_price }
 * @param {number} aiScore - AI Score (0-100)
 * @returns {object} - Final price and breakdown
 */
function calculateFinalPrice(car, aiScore) {
    const currentYear = new Date().getFullYear();
    const carYear = car.year;
    const basePrice = parseFloat(car.base_price);
    const mileage = car.mileage; // Odometer reading

    // 1. Depreciation (Age-Based)
    const age = currentYear - carYear;
    let depreciationPercent = 0;

    if (age <= 1) depreciationPercent = 0.05;
    else if (age <= 3) depreciationPercent = 0.10;
    else if (age <= 5) depreciationPercent = 0.15;
    else depreciationPercent = 0.20;

    const priceAfterDepreciation = basePrice * (1 - depreciationPercent);

    // 2. Mileage Factor
    let mileageFactor = 1.0;
    if (mileage < 30000) mileageFactor = 1.00;
    else if (mileage < 60000) mileageFactor = 0.95;
    else if (mileage < 100000) mileageFactor = 0.90;
    else mileageFactor = 0.85;

    // 3. Demand Factor (AI Score)
    let demandFactor = 1.0;
    if (aiScore >= 90) demandFactor = 1.05;
    else if (aiScore >= 80) demandFactor = 1.03;
    else if (aiScore >= 70) demandFactor = 1.01;
    else demandFactor = 0.98;

    // Final Calculation
    let finalPrice = priceAfterDepreciation * mileageFactor * demandFactor;

    // Round to nearest 100
    finalPrice = Math.round(finalPrice / 100) * 100;

    return {
        final_price: finalPrice,
        breakdown: {
            base_price: basePrice,
            age: age,
            depreciation_percent: depreciationPercent,
            mileage_factor: mileageFactor,
            demand_factor: demandFactor,
            ai_score: aiScore
        }
    };
}

module.exports = {
    calculateFinalPrice
};
