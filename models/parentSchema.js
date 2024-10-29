
const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    childSchoolId: { type: String, required: true ,unique : true },
    schoolName : {
        type: String ,
        required : true,
    },
    
    society: { type: String }, 
    socialCircles: [
        {
            circleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle' },
            circleName: { type: String } ,
            discoverability: { type: String , default: false}
        }
    ],
    email: { type: String},
    password: { type: String, required: true },
    grade: { type: String, required: true }, 
    section: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Parent', parentSchema);

 

