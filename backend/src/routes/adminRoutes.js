const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// POST /api/admin/login (Public route - no auth needed)
router.post('/login', adminController.login);

// Example: Protected admin-only route
// Requires valid JWT token with role = "admin"
router.get('/dashboard', authenticate, authorize('admin'), (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Admin Dashboard',
        user: req.user
    });
});

// POST /api/admin/cars (Admin only)
router.post('/cars', authenticate, authorize('admin'), adminController.addCar);

// PUT /api/admin/cars/:id (Admin only)
router.put('/cars/:id', authenticate, authorize('admin'), adminController.updateCar);

// DELETE /api/admin/cars/:id (Admin only)
router.delete('/cars/:id', authenticate, authorize('admin'), adminController.deleteCar);

module.exports = router;
