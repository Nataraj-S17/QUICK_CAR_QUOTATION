const aiService = require('../services/aiService');

/**
 * AI Controller
 * Handles HTTP requests for AI requirement interpretation
 */

/**
 * Interpret a single customer requirement
 * POST /api/ai/interpret
 * Body: { requirement_id: number }
 */
async function interpretRequirement(req, res) {
    try {
        const { requirement_id } = req.body;

        // Validate input
        if (!requirement_id) {
            return res.status(400).json({
                success: false,
                message: 'requirement_id is required in request body'
            });
        }

        // Call AI service
        const aiInterpretation = await aiService.interpretCustomerRequirement(requirement_id);

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Requirement interpreted successfully',
            data: aiInterpretation
        });
    } catch (error) {
        console.error('Error in interpretRequirement controller:', error);

        // Handle specific errors
        if (error.message.includes('not found')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        // Generic error response
        return res.status(500).json({
            success: false,
            message: 'Failed to interpret requirement',
            error: error.message
        });
    }
}

/**
 * Batch interpret multiple requirements
 * POST /api/ai/interpret/batch
 * Body: { requirement_ids: number[] }
 */
async function batchInterpretRequirements(req, res) {
    try {
        const { requirement_ids } = req.body;

        // Validate input
        if (!requirement_ids || !Array.isArray(requirement_ids)) {
            return res.status(400).json({
                success: false,
                message: 'requirement_ids array is required in request body'
            });
        }

        // Call AI service
        const aiInterpretations = await aiService.batchInterpretRequirements(requirement_ids);

        // Return success response
        return res.status(200).json({
            success: true,
            message: `${aiInterpretations.length} requirements interpreted successfully`,
            data: aiInterpretations
        });
    } catch (error) {
        console.error('Error in batchInterpretRequirements controller:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to interpret requirements',
            error: error.message
        });
    }
}

/**
 * Interpret all requirements for a customer
 * GET /api/ai/interpret/customer/:customerId
 */
async function interpretCustomerRequirements(req, res) {
    try {
        const { customerId } = req.params;

        // Validate input
        if (!customerId || isNaN(customerId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid customer ID is required'
            });
        }

        // Call AI service
        const aiInterpretations = await aiService.interpretAllCustomerRequirements(customerId);

        // Return success response
        return res.status(200).json({
            success: true,
            message: `Interpreted ${aiInterpretations.length} requirements for customer ${customerId}`,
            data: aiInterpretations
        });
    } catch (error) {
        console.error('Error in interpretCustomerRequirements controller:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to interpret customer requirements',
            error: error.message
        });
    }
}

/**
 * Score and rank cars for a requirement
 * POST /api/ai/score
 * Body: { requirement_id: number }
 */
async function scoreCars(req, res) {
    try {
        const { requirement_id } = req.body;

        if (!requirement_id) {
            return res.status(400).json({
                success: false,
                message: 'requirement_id is required'
            });
        }

        const result = await aiService.scoreAndRankCars(requirement_id);

        return res.status(200).json({
            success: true,
            message: 'Cars scored and ranked successfully',
            data: result
        });

    } catch (error) {
        console.error('Error in scoreCars controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to score cars',
            error: error.message
        });
    }
}

module.exports = {
    interpretRequirement,
    batchInterpretRequirements,
    interpretCustomerRequirements,
    scoreCars
};
