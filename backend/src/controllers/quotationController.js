const quotationService = require('../services/quotationService');

/**
 * Generate AI Quotation
 * POST /api/ai/generate-quotation
 * Body: { requirement_id: number }
 */
async function generateQuotation(req, res) {
    try {
        const { requirement_id } = req.body;

        if (!requirement_id) {
            return res.status(400).json({
                success: false,
                message: 'requirement_id is required'
            });
        }

        const result = await quotationService.generateQuotation(requirement_id);

        if (result.status === 'error') {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        return res.status(200).json({
            success: true,
            data: result.quotation
        });

    } catch (error) {
        console.error('Error in generateQuotation controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate quotation',
            error: error.message
        });
    }
}

module.exports = {
    generateQuotation
};
