const recommendationService = require('../services/recommendationService');

/**
 * Get AI Recommendation
 * POST /api/ai/recommend
 * Body: { requirement_id: number }
 */
async function recommendCar(req, res) {
    try {
        const { requirement_id } = req.body;

        if (!requirement_id) {
            return res.status(400).json({
                success: false,
                message: 'requirement_id is required'
            });
        }

        const result = await recommendationService.getRecommendation(requirement_id);

        if (result.status === 'no_match') {
            return res.status(404).json({
                success: false,
                message: result.message
            });
        }

        return res.status(200).json({
            success: true,
            data: result.recommendation
        });

    } catch (error) {
        console.error('Error in recommendCar controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate recommendation',
            error: error.message
        });
    }
}

module.exports = {
    recommendCar
};
