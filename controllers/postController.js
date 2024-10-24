// /controllers/postController.js
const Post = require('../models/postSchema.js');
const Parent = require('../models/parentSchema'); 
const mongoose = require("mongoose")


const isParentInCircle = async (req, res, next) => {
    const { circleId, parentId } = req.body; // Get both circleId and parentId from body

    try {
        const parent = await Parent.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: "Parent not found." });
        }

        if (!parent.socialCircles.some(circle => circle.circleId.toString() === circleId)) {
            return res.status(403).json({ message: "You are not a member of this circle." });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a post in a circle
const createPost = async (req, res) => {
    const { content, parentId, circleId } = req.body; // Extract content, parentId, and circleId from body

    try {
        const newPost = new Post({
            parentId,
            circleId,
            content
        });
        await newPost.save();
        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
};

// Reply to a Post
const replyToPost = async (req, res) => {
    const { content, parentId, postId } = req.body; // Extract content, parentId, and postId from body

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const reply = {
            parentId,
            content
        };
        post.replies.push(reply);
        await post.save();
        res.status(201).json({ message: "Reply added successfully", reply });
    } catch (error) {
        res.status(500).json({ message: "Error adding reply", error: error.message });
    }
};

// Reply to a Reply
const replyToReply = async (req, res) => {
    const { content, parentId, postId, replyId } = req.body;

    try {
        // Find the post
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Find the original reply
        const reply = post.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        // Create a new reply document
        const newThreadReply = new Reply({
            parentId: mongoose.Types.ObjectId(parentId), // Convert to ObjectId
            content,
            votes: 0,
            replies: [] // This can be empty for now; you can add further replies if needed
        });

        // Save the new reply document to the database
        await newThreadReply.save();

        // Push the new reply's ObjectId into the original reply's replies array
        reply.replies.push(newThreadReply._id);
        await post.save(); // Save the updated post

        // Send a success response with the new reply
        res.status(201).json({ message: "Thread reply added successfully", reply: newThreadReply });
    } catch (error) {
        res.status(500).json({ message: "Error adding thread reply", error: error.message });
    }
};


// Vote on a Post or Reply
const votePost = async (req, res) => {
    const { voteType, postId, parentId } = req.body; // Extract voteType, postId, and parentId from body

    try {
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (voteType === "upvote") {
            post.votes += 1;
        } else if (voteType === "downvote") {
            post.votes -= 1;
        } else {
            return res.status(400).json({ message: "Invalid vote type" });
        }

        await post.save();
        res.status(200).json({ message: "Vote updated successfully", votes: post.votes });
    } catch (error) {
        res.status(500).json({ message: "Error voting on post", error: error.message });
    }
};

module.exports = {
    isParentInCircle,
    createPost,
    replyToPost,
    replyToReply,
    votePost
};
