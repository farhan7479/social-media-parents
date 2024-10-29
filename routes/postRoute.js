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

// Create a post in a circle
router.post('/add', JwtVerify, isParentInCircle, createPost);

// Reply to a Post
router.post('/replies', JwtVerify, isParentInCircle, replyToPost);

// Reply to a Reply
router.post('/replies/reply', JwtVerify, isParentInCircle, replyToReply);

// Vote on a Post or Reply
router.post('/vote', JwtVerify, isParentInCircle, votePost);

module.exports = router;
