
const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parent' }], 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    type: { type: String, enum: ['auto-joined', 'opt-in'], default: 'auto-joined' },
    discoverability: { type: Boolean, default: false },
    subCircles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circle'
    }]
});

module.exports = mongoose.model('Circle', circleSchema);
