const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const aiController = require('../controllers/aiController'); // Existing AI routes

// Merge with existing AI routes if possible, or usually creating a new file is cleaner.
// But wait, the system likely has `aiRoutes.js`. I can append to it or create `recommendationRoutes.js` and mount it?
// The prompt pattern suggests `recommendationRoutes.js`.
// However, the user might want all AI stuff under `/api/ai`.
// Let's create `recommendationRoutes.js` and the user (or I) will mount it in server.js.

/**
 * @route   POST /api/ai/recommend
 * @desc    Get best car recommendation with explanation
 * @body    { requirement_id: number }
 * @access  Public
 */
router.post('/recommend', recommendationController.recommendCar);

module.exports = router;
