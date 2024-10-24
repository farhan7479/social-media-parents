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
            `Section ${section}, ${schoolName}`,
            community,
            `${community}, ${schoolName}`
        ];

        const findOrCreateCircle = async (circleName) => {
            let circle = await Circle.findOne({ name: circleName });
            if (!circle) {
                circle = new Circle({ name: circleName });
                await circle.save();
            }
            // Add the parent to the circle's members if not already present
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


// Export the upload middleware and controller


// Join Circle
exports.joinCircle = async (req, res) => {
    const { parentId, childSchoolId, grade, section, society } = req.body;

    try {
        // Find or create circles
        const schoolCircle = await Circle.findOne({ name: childSchoolId }) || await Circle.create({ name: childSchoolId, circleType: 'School', members: [] });
        const classCircle = await Circle.findOne({ name: `${grade}, ${childSchoolId}` }) || await Circle.create({ name: `${grade}, ${childSchoolId}`, circleType: 'Class', members: [] });
        const sectionCircle = await Circle.findOne({ name: `${section}, ${grade}, ${childSchoolId}` }) || await Circle.create({ name: `${section}, ${grade}, ${childSchoolId}`, circleType: 'Section', members: [] });
        const societyCircle = society ? await Circle.findOne({ name: society }) || await Circle.create({ name: society, circleType: 'Society', members: [] }) : null;

        // Add parent to circles
        const circles = [schoolCircle, classCircle, sectionCircle, societyCircle].filter(Boolean);
        circles.forEach(async (circle) => {
            if (!circle.members.includes(parentId)) {
                circle.members.push(parentId);
                await circle.save();
            }
        });

        // Add circles to parent
        const parent = await Parent.findByIdAndUpdate(parentId, {
            $addToSet: {
                socialCircles: circles.map(circle => ({ circleId: circle._id, circleType: circle.circleType }))
            }
        }, { new: true });

        res.json({ message: "Parent joined the circles successfully", circlesJoined: circles.map(circle => circle._id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

