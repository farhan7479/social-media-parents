// routes/parentRoutes.js
const express = require('express');
const router = express.Router();

const { signupParent , getParentCircles} = require("../controllers/parentController.js");

router.post("/signup",  signupParent); 
// Join Circle


// Get Parent's Circles
router.get('/:parentId/circles', getParentCircles);

module.exports = router;
