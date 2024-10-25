// /models/Post.js
const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }]
});

const postSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
    circleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 },
    replies: [replySchema] 
});

module.exports = mongoose.model('Post', postSchema);

