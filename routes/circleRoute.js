const express = require('express');
const router = express.Router();
const circleController = require('../controllers/circleController.js');
const JwtVerify = require('../middleware/parentAuthenticate');

// Route to create a circle
router.post('/create', JwtVerify,  circleController.createCircle);

// Route to get all circles
router.get('/parents/all', JwtVerify, circleController.getParentWithCircles);

router.get('/all', JwtVerify, circleController.getAllCircles);

module.exports = router;
