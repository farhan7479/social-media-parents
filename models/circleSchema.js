
const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parent' }], 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Circle', circleSchema);
