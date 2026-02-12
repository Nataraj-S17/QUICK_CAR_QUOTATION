/**
 * AI Scoring Engine
 * 
 * Ranks cars based on how well they match customer requirements.
 * Deterministic, rule-based logic (0-100 score).
 */

/**
 * Calculates Budget Score (Max 30 points)
 * @param {number} carPrice 
 * @param {number} budget 
 * @returns {object} { score, reason }
 */
function calculateBudgetScore(carPrice, budget) {
    if (carPrice <= budget) {
        return { score: 30, reason: 'Within budget' };
    } else if (carPrice <= budget * 1.10) {
        return { score: 15, reason: 'Slightly above budget (within 10%)' };
    } else {
        return { score: 0, reason: 'Over budget' };
    }
}

/**
 * Calculates Mileage Score (Max 25 points)
 * @param {number} carMileage 
 * @param {number} minMileage 
 * @returns {object} { score, reason }
 */
function calculateMileageScore(carMileage, minMileage) {
    if (!minMileage) {
        return { score: 25, reason: 'No mileage constraint' }; // Logically full score if no constraint
    }

    if (carMileage >= minMileage) {
        return { score: 25, reason: 'Meets mileage requirement' };
    } else if (carMileage >= minMileage - 2) {
        return { score: 10, reason: 'Slightly below mileage target (within 2 kmpl)' };
    } else {
        return { score: 0, reason: 'Low mileage' };
    }
}

/**
 * Calculates Usage Match Score (Max 20 points)
 * @param {string} bodyType 
 * @param {string} model 
 * @param {string} usagePattern 
 * @returns {object} { score, reason }
 */
function calculateUsageScore(bodyType, model, usagePattern) {
    const type = bodyType ? bodyType.toUpperCase() : '';
    // Normalize usage pattern just in case
    const pattern = usagePattern ? usagePattern.toUpperCase() : 'CITY';

    switch (pattern) {
        case 'FAMILY':
            if (['SUV', 'MUV', 'SEDAN'].includes(type)) return { score: 20, reason: 'Perfect family car body type' };
            if (type === 'HATCHBACK') return { score: 10, reason: 'Decent family car option' };
            break;

        case 'CITY':
            if (['HATCHBACK', 'COMPACT_SUV'].includes(type) || model.includes('Alto') || model.includes('Kwid')) {
                return { score: 20, reason: 'Perfect city car (compact)' };
            }
            if (['SEDAN'].includes(type)) return { score: 10, reason: 'Manageable for city' };
            break;

        case 'LONG_DRIVE':
            if (['SEDAN', 'SUV', 'MUV', 'LUXURY_SEDAN'].includes(type)) return { score: 20, reason: 'Great for highway stability' };
            break;

        case 'BUSINESS':
            // Logic for premium look. Premium usually means Sedan or specific brands.
            // For now, let's look at body type and maybe simple brand implementation if needed, 
            // but prompt says "Premium brand -> +20". We'll use body type primarily here 
            // and assume Maintenance/Brand check handles the "Premium Brand" part or add generic logic.
            // Actually prompt usage rule says: "BUSINESS: Premium brand -> +20". 
            // This overlaps with Brand check. Let's interpret "Premium Look" -> Sedan/SUV/Luxury
            if (['SEDAN', 'LUXURY_SEDAN', 'SUV'].includes(type)) return { score: 20, reason: 'Professional appearance' };
            break;
    }

    return { score: 0, reason: 'Usage mismatch' };
}

/**
 * Calculates Maintenance/Brand Score (Max 15 points)
 * @param {string} brand 
 * @param {string} maintenancePriority 
 * @returns {object} { score, reason }
 */
function calculateMaintenanceScore(brand, maintenanceScore) {
    const reliableBrands = ['MARUTI', 'TOYOTA', 'HONDA', 'HYUNDAI'];
    const b = brand ? brand.toUpperCase() : '';

    if (maintenanceScore === 'LOW_MAINTENANCE' || maintenanceScore === 'LOW') {
        if (reliableBrands.some(rb => b.includes(rb))) {
            return { score: 15, reason: 'Reliable brand (Low Maintenance)' };
        }
        return { score: 5, reason: 'Standard maintenance' };
    }

    if (maintenanceScore === 'BALANCED' || maintenanceScore === 'MEDIUM') {
        return { score: 10, reason: 'Balanced maintenance' };
    }

    // ANY or others
    return { score: 5, reason: 'No maintenance preference' };
}

/**
 * Calculates Bonus Score (Max 10 points)
 * @param {number} year 
 * @returns {object} { score, reason }
 */
function calculateBonusScore(year) {
    if (year >= 2020) return { score: 10, reason: 'New model (2020+)' };
    if (year >= 2017) return { score: 5, reason: 'Recent model (2017+)' };
    return { score: 0, reason: 'Older model' };
}

/**
 * Main Scoring Function
 * @param {object} car - Car object from DB
 * @param {object} requirement - Structured AI requirement (from interpretRequirement)
 * @returns {object} - Scored car object
 */
function scoreCar(car, requirement) {
    // 1. Budget Score
    const budgetResult = calculateBudgetScore(parseFloat(car.base_price), parseFloat(requirement.interpretations.budget.amount));

    // 2. Mileage Score
    const mileageResult = calculateMileageScore(car.mileage, requirement.min_mileage);

    // 3. Usage Score
    const usageResult = calculateUsageScore(car.body_type, car.model, requirement.usage_pattern);

    // 4. Maintenance Score
    const maintenanceResult = calculateMaintenanceScore(car.brand, requirement.maintenance_score);

    // 5. Bonus Score
    const bonusResult = calculateBonusScore(car.year);

    // Total Score
    const totalScore = budgetResult.score +
        mileageResult.score +
        usageResult.score +
        maintenanceResult.score +
        bonusResult.score;

    return {
        ...car,
        ai_score: totalScore,
        match_details: {
            budget_score: budgetResult,
            mileage_score: mileageResult,
            usage_score: usageResult,
            maintenance_score: maintenanceResult,
            bonus_score: bonusResult
        }
    };
}

/**
 * Sorts cars by score descending
 * @param {Array} scoredCars 
 * @returns {Array} Sorted cars
 */
function rankCars(scoredCars) {
    return scoredCars.sort((a, b) => b.ai_score - a.ai_score);
}

module.exports = {
    scoreCar,
    rankCars,
    calculateBudgetScore,
    calculateMileageScore,
    calculateUsageScore,
    calculateMaintenanceScore,
    calculateBonusScore
};
