const Post = require("../models/postSchema.js");
const Parent = require("../models/parentSchema");
const mongoose = require("mongoose");
const Reply = require ("./../models/replySchema.js");

const isParentInCircle = async (req, res, next) => {
    const parentId = req.parentId;
    const { circleId } = req.body;

    try {
        const parent = await Parent.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: "Parent not found." });
        }

        if (
            !parent.socialCircles.some(
                (circle) => circle.circleId.toString() === circleId
            )
        ) {
            return res
                .status(403)
                .json({ message: "You are not a member of this circle." });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createPost = async (req, res) => {

    const { content, circleId } = req.body;

    try {
        const parentId = req.parentId;
        const newPost = new Post({
            parentId,
            circleId,
            content,
        });
        await newPost.save();
        res
            .status(201)
            .json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error creating post", error: error.message });
    }
};

const replyToPost = async (req, res) => {
    const { content, postId } = req.body;

    try {
        const parentId = req.parentId;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newReply = new Reply({
            parentId,
            postId,
            content,
            votes: 0
        });

        await newReply.save();
        post.replies.push(newReply._id);
        await post.save();

        res.status(201).json({
            message: "Reply added successfully",
            reply: newReply,
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding reply", error: error.message });
    }
};

const replyToReply = async (req, res) => {
    const { content, postId, replyId } = req.body;

    try {
        const parentId = req.parentId; 

        
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        
        const originalReply = await Reply.findById(replyId);
        if (!originalReply) return res.status(404).json({ message: "Reply not found" });

        
        const newReply = new Reply({
            parentId, 
            postId, 
            content, 
            votes: 0, 
            replyTo: replyId
        });

        
        await newReply.save();
        

        res.status(201).json({
            message: "Reply added successfully",
            reply: newReply,
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding reply", error: error.message });
    }
};


const votePost = async (req, res) => {
    const { voteType, postId } = req.body;

    try {
        const parentId = req.parentId;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const existingVote = post.voters.find(
            (vote) => vote.parentId.toString() === parentId
        );

        if (existingVote) {
            if (existingVote.voteType !== voteType) {
                existingVote.voteType = voteType;
                voteType === "upvote" ? (post.votes += 2) : (post.votes -= 2);
            } else {
                return res
                    .status(400)
                    .json({ message: "You have already cast this vote" });
            }
        } else {
            post.voters.push({ parentId, voteType });
            voteType === "upvote" ? (post.votes += 1) : (post.votes -= 1);
        }

        await post.save();
        res
            .status(200)
            .json({ message: "Vote updated successfully", votes: post.votes });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error voting on post", error: error.message });
    }
};

module.exports = {
    isParentInCircle,
    createPost,
    replyToPost,
    replyToReply,
    votePost,
};
