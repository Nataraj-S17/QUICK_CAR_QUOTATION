const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// GET /api/cars (Public)
router.get('/', carController.getCars);

module.exports = router;
