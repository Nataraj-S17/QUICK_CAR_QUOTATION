const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// POST /api/customer/register (Public route - no auth needed)
router.post('/register', customerController.register);

// POST /api/customer/login (Public route - no auth needed)
router.post('/login', customerController.login);

// POST /api/customer/requirements (Protected - Customer only)
router.post('/requirements', authenticate, authorize('customer'), customerController.saveRequirement);

// Example: Protected customer-only route
// Requires valid JWT token with role = "customer"
router.get('/profile', authenticate, authorize('customer'), (req, res) => {
    res.json({
        success: true,
        message: 'Customer profile accessed successfully',
        user: req.user
    });
});

module.exports = router;
