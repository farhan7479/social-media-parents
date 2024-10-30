
const express = require('express');
const router = express.Router();
const JwtVerify = require('../middleware/parentAuthenticate');

const { signupParent ,  loginParent, updateParentDetails} = require("../controllers/parentController.js");
const { joinCircle } = require('../controllers/circleController.js');

router.post("/signup",  signupParent); 
router.post("/login",  loginParent);
router.put('/update-parent',JwtVerify, updateParentDetails);
router.post("/join-circle",JwtVerify, joinCircle);




module.exports = router;
