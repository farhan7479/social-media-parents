const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, 
    content: { type: String, required: true },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Reply' },
    createdAt: { type: Date, default: Date.now },
    
});

module.exports = mongoose.model('Reply', replySchema);
