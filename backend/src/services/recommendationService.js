const aiService = require('./aiService');
const { selectBestCar, generateExplanation } = require('../ai/recommendationEngine');

/**
 * Generate a car recommendation for a given requirement.
 * @param {number} requirementId 
 * @returns {Promise<object>} Recommendation result
 */
async function getRecommendation(requirementId) {
    try {
        // 1. Score all cars using Day 15 Logic
        const scoredResult = await aiService.scoreAndRankCars(requirementId);

        if (!scoredResult.ranked_cars || scoredResult.ranked_cars.length === 0) {
            return {
                status: 'no_match',
                message: 'No suitable cars found for your requirements.'
            };
        }

        // 2. Select Best Car
        const bestCar = selectBestCar(scoredResult.ranked_cars);

        if (!bestCar) {
            return {
                status: 'error',
                message: 'Failed to select a car.'
            };
        }

        // 3. Generate Explanation
        const explanation = generateExplanation(bestCar, scoredResult.requirement);

        // 4. Return Output
        return {
            status: 'success',
            recommendation: {
                car: {
                    id: bestCar.id,
                    brand: bestCar.brand,
                    model: bestCar.model,
                    year: bestCar.year,
                    price: bestCar.base_price,
                    image: bestCar.image_url || null // Assuming image_url might exist or null
                },
                score: bestCar.ai_score,
                explanation: explanation,
                match_details: bestCar.match_details // Optional: Include breakdown if needed
            }
        };

    } catch (error) {
        console.error('Error in getRecommendation service:', error);
        throw error;
    }
}

module.exports = {
    getRecommendation
};
