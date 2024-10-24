// routes/circleRoutes.js
const express = require('express');
const router = express.Router();
const circleController = require('../controllers/circleController');

// Create Circle
router.post('/', circleController.createCircle);

module.exports = router;
