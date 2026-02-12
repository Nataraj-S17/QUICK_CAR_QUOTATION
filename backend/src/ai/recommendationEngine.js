/**
 * AI Recommendation Engine
 * 
 * Selects the best car and generates a human-readable explanation.
 */

const { calculateBudgetScore, calculateMileageScore, calculateUsageScore, calculateMaintenanceScore } = require('./scoringEngine');

/**
 * Selects the best car from the scored list.
 * Rules:
 * 1. Highest AI Score
 * 2. If tie, Lower Price
 * 3. If tie, Newer Year
 * 
 * @param {Array} scoredCars 
 * @returns {object} Best car
 */
function selectBestCar(scoredCars) {
    if (!scoredCars || scoredCars.length === 0) return null;

    return scoredCars.sort((a, b) => {
        // 1. Score (High to Low)
        if (b.ai_score !== a.ai_score) {
            return b.ai_score - a.ai_score;
        }

        // 2. Price (Low to High)
        // Ensure price is treated as number
        const priceA = parseFloat(a.base_price);
        const priceB = parseFloat(b.base_price);
        if (priceA !== priceB) {
            return priceA - priceB;
        }

        // 3. Year (New to Old)
        return b.year - a.year;
    })[0];
}

/**
 * Generates a human-readable explanation for the recommendation.
 * @param {object} car 
 * @param {object} requirement 
 * @returns {string} Explanation text
 */
function generateExplanation(car, requirement) {
    if (!car || !requirement) return "We recommend this car based on your preferences.";

    const parts = [];

    // 1. Budget Match
    const budgetLimit = parseFloat(requirement.interpretations.budget.amount);
    const carPrice = parseFloat(car.base_price);

    if (carPrice <= budgetLimit) {
        parts.push("fits within your budget");
    } else if (carPrice <= budgetLimit * 1.10) {
        parts.push("is slightly above budget but offers strong value");
    }

    // 2. Mileage Match
    const mileageTarget = requirement.min_mileage;
    const carEfficiency = car.fuel_efficiency ? parseFloat(car.fuel_efficiency) : 0;

    if (mileageTarget && carEfficiency >= mileageTarget) {
        parts.push("offers excellent fuel efficiency");
    }

    // 3. Usage Match
    // Logic from prompt:
    // FAMILY: "spacious and comfortable for family use"
    // CITY: "compact and ideal for city driving"
    // LONG_DRIVE: "comfortable and stable for long journeys"
    // BUSINESS: "premium styling suitable for professional needs"

    const usageType = requirement.original_usage_type ? requirement.original_usage_type.toUpperCase() : 'CITY';
    // Map normalized usage types if needed, but interpretation produces standardized types
    const interpretedUsage = requirement.interpretations.usage.type; // e.g. FAMILY, CITY

    switch (interpretedUsage) {
        case 'FAMILY':
            parts.push("provides spacious comfort suitable for family use");
            break;
        case 'CITY':
            parts.push("is compact and ideal for city driving");
            break;
        case 'LONG_DRIVE':
            parts.push("is comfortable and stable for long journeys");
            break;
        case 'BUSINESS':
            parts.push("features premium styling suitable for professional needs");
            break;
        default:
            // Fallback based on body type?
            if (car.body_type === 'SUV') parts.push("provides great space and presence");
            break;
    }

    // 4. Maintenance / Reliability
    if (requirement.interpretations.maintenance.priority === 'LOW') {
        const reliableBrands = ['Maruti', 'Toyota', 'Honda', 'Hyundai'];
        if (reliableBrands.some(brand => car.brand.includes(brand))) {
            parts.push("is known for reliability and low maintenance cost");
        }
    }

    // Assemble sentence
    // "We recommend the 2021 Honda City because [part1], [part2], and [part3]."

    let reason = "";
    if (parts.length === 0) {
        reason = "it matches your requirements well";
    } else if (parts.length === 1) {
        reason = `it ${parts[0]}`;
    } else {
        const lastPart = parts.pop();
        reason = `it ${parts.join(", ")}, and ${lastPart}`;
    }

    return `We recommend the ${car.year} ${car.brand} ${car.model} because ${reason}.`;
}

module.exports = {
    selectBestCar,
    generateExplanation
};
