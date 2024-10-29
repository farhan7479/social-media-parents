const express = require('express');
const {
    isParentInCircle,
    createPost,
    replyToPost,
    replyToReply,
    votePost
} = require('../controllers/postController');
const JwtVerify = require('../middleware/parentAuthenticate');

const router = express.Router();


router.post('/add', JwtVerify, isParentInCircle, createPost);


router.post('/replies', JwtVerify, isParentInCircle, replyToPost);


router.post('/replies/reply', JwtVerify, isParentInCircle, replyToReply);


router.post('/vote', JwtVerify, isParentInCircle, votePost);

module.exports = router;
