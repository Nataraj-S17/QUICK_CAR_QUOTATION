const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

/**
 * AI Routes
 * Endpoints for AI requirement interpretation
 */

/**
 * @route   POST /api/ai/interpret
 * @desc    Interpret a single customer requirement
 * @body    { requirement_id: number }
 * @access  Public (can be protected later)
 */
router.post('/interpret', aiController.interpretRequirement);

/**
 * @route   POST /api/ai/interpret/batch
 * @desc    Batch interpret multiple requirements
 * @body    { requirement_ids: number[] }
 * @access  Public (can be protected later)
 */
router.post('/interpret/batch', aiController.batchInterpretRequirements);

/**
 * @route   GET /api/ai/interpret/customer/:customerId
 * @desc    Interpret all requirements for a specific customer
 * @param   customerId - Customer ID
 * @access  Public (can be protected later)
 */
router.get('/interpret/customer/:customerId', aiController.interpretCustomerRequirements);

/**
 * @route   POST /api/ai/score
 * @desc    Score and rank cars based on a requirement
 * @body    { requirement_id: number }
 * @access  Public
 */
router.post('/score', aiController.scoreCars);

module.exports = router;
