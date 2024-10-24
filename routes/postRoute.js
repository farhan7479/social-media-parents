// /routes/postRoutes.js
const express = require('express');
const {
    isParentInCircle,
    createPost,
    replyToPost,
    replyToReply,
    votePost
} = require('../controllers/postController');

const router = express.Router();

// Create a post in a circle
router.post('/add', isParentInCircle, createPost);

// Reply to a Post
router.post('/replies', isParentInCircle, replyToPost);

// Reply to a Reply
router.post('/replies/replies', isParentInCircle, replyToReply);

// Vote on a Post or Reply
router.post('/posts/vote', isParentInCircle, votePost);

module.exports = router;
