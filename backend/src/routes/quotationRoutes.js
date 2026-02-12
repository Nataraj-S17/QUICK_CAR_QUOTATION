const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');

/**
 * @route   POST /api/ai/generate-quotation
 * @desc    Generate a final price quotation using AI engines
 * @body    { requirement_id: number }
 * @access  Public (or Protected)
 */
router.post('/generate-quotation', quotationController.generateQuotation);

module.exports = router;
