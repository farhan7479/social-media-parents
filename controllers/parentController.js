// controllers/parentController.js
const Parent = require('../models/parentSchema.js');
const Circle = require('../models/circleSchema.js');


exports.signupParent = async (req, res) => {
    try {
        const { name, childSchoolId, community, schoolName, grade, section } = req.body;

        const newParent = new Parent({
            name,
            childSchoolId,
            community,
            schoolName,
            grade,
            section,
            socialCircles: [],
        });

        await newParent.save();

        const circlesToCreate = [
            `${schoolName}`,
            `Class ${grade}, ${schoolName}`,
            `Section ${section}, Class ${grade}, ${schoolName}`
        ];

        if (community) {
            circlesToCreate.push(
                community,
                `${community}, ${schoolName}`
            );
        }

        const findOrCreateCircle = async (circleName) => {
            let circle = await Circle.findOne({ name: circleName });
            if (!circle) {
                circle = new Circle({ name: circleName });
                await circle.save();
            }
            if (!circle.members.includes(newParent._id)) {
                circle.members.push(newParent._id);
                await circle.save();
            }
            return { circleId: circle._id, circleName: circle.name };
        };

        const circleDetails = await Promise.all(circlesToCreate.map(findOrCreateCircle));

        newParent.socialCircles = circleDetails; 
        await newParent.save(); 

        res.status(201).json({ message: "Parent signed up successfully", newParent });
    } catch (error) {
        res.status(500).json({ message: "Error signing up parent", error: error.message });
    }
};




// Get Parent's Circles
exports.getParentCircles = async (req, res) => {
    try {
        const parent = await Parent.findById(req.params.parentId).populate('socialCircles.circleId');

        if (!parent) {
            return res.status(404).json({ message: "Parent not found" });
        }

        const circles = parent.socialCircles.map(circle => ({
            circleId: circle.circleId,
            circleName: circle.circleName,
        }));

        res.status(200).json({ 
            message: "Successfully retrieved parent circles", 
            circles 
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving parent circles", error: error.message });
    }
};

