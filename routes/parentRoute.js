// routes/parentRoutes.js
const express = require('express');
const router = express.Router();
const JwtVerify = require('../middleware/parentAuthenticate');

const { signupParent ,  loginParent, updateParentDetails} = require("../controllers/parentController.js");

router.post("/signup",  signupParent); 
router.post("/login",  loginParent);
router.put('/update-parent',JwtVerify, updateParentDetails);




module.exports = router;
