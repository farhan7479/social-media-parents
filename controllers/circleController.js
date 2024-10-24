// controllers/circleController.js
const Circle = require('../models/circleSchema.js');

// Create Circle (if necessary)
exports.createCircle = async (req, res) => {
    const { name, circleType } = req.body;

    try {
        const circle = await Circle.findOne({ name });
        if (circle) {
            return res.status(400).json({ message: "Circle already exists" });
        }
        
        const newCircle = new Circle({ name, circleType });
        await newCircle.save();
        res.status(201).json({ message: "Circle created successfully", circleId: newCircle._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
