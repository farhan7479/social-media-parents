// routes/parentRoutes.js
const express = require('express');
const router = express.Router();

const { signupParent ,joinCircle, getParentCircles} = require("../controllers/parentController");

router.post("/signup",  signupParent); 
// Join Circle
router.post('/join-circle', joinCircle);

// Get Parent's Circles
router.get('/:parentId/circles', getParentCircles);

module.exports = router;
