const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
    circleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 },
    voters: [
        {
            parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
            voteType: { type: String, enum: ['upvote', 'downvote'] }
        }
    ],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }] 
});

module.exports = mongoose.model('Post', postSchema);
