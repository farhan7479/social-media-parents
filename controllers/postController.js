
const Post = require('../models/postSchema.js');
const Parent = require('../models/parentSchema'); 
const mongoose = require("mongoose")


const isParentInCircle = async (req, res, next) => {
    const { circleId, parentId } = req.body; 

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


const createPost = async (req, res) => {
    const { content, parentId, circleId } = req.body; 

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


const replyToPost = async (req, res) => {
    const { content, parentId, postId } = req.body; 

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

const replyToReply = async (req, res) => {
    const { content, parentId, postId, replyId } = req.body;

    try {
        
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        
        const reply = post.replies.id(replyId);
        if (!reply) return res.status(404).json({ message: "Reply not found" });

        
        const newThreadReply = new Reply({
            parentId: mongoose.Types.ObjectId(parentId), 
            content,
            votes: 0,
            replies: [] 
        });

        
        await newThreadReply.save();

        
        reply.replies.push(newThreadReply._id);
        await post.save(); 

        
        res.status(201).json({ message: "Thread reply added successfully", reply: newThreadReply });
    } catch (error) {
        res.status(500).json({ message: "Error adding thread reply", error: error.message });
    }
};



const votePost = async (req, res) => {
    const { voteType, postId, parentId } = req.body; 

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
