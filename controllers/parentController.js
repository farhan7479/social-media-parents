
const Parent = require('../models/parentSchema.js');
const Circle = require('../models/circleSchema.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



exports.signupParent = async (req, res) => {
    try {
        const { name, childSchoolId, community, schoolName, grade, section, password, discoverability } = req.body;

        const existingParent = await Parent.findOne({ childSchoolId });
        if (existingParent) {
            return res.status(400).json({ message: "Parent with this child school ID already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newParent = new Parent({
            name,
            childSchoolId,
            community,
            schoolName,
            grade,
            section,
            password: hashedPassword,
            socialCircles: [],
        });

        await newParent.save();

        const circlesToCreate = [
            { name: `${schoolName}`, discoverability },
            { name: `Class ${grade}, ${schoolName}`, discoverability },
            { name: `Section ${section}, Class ${grade}, ${schoolName}`, discoverability }
        ];

        if (community) {
            circlesToCreate.push(
                { name: community, discoverability },
                { name: `${community}, ${schoolName}`, discoverability }
            );
        }

        const findOrCreateCircle = async (circleData) => {
            let circle = await Circle.findOne({ name: circleData.name });
            if (!circle) {
                circle = new Circle({
                    name: circleData.name,
                    type: "auto-joined",
                    discoverability: circleData.discoverability
                });
                await circle.save();
            }

            if (!circle.members.includes(newParent._id)) {
                circle.members.push(newParent._id);
                await circle.save();
            }

            return {
                circleId: circle._id,
                circleName: circle.name,
                discoverability: circleData.discoverability
            };
        };

        const circleDetails = await Promise.all(circlesToCreate.map(findOrCreateCircle));
        newParent.socialCircles = circleDetails;
        await newParent.save();
        const token = jwt.sign({ parentId: newParent._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: "Parent signed up successfully", newParent, token });
    } catch (error) {
        res.status(500).json({ message: "Error signing up parent", error: error.message });
    }
};


exports.loginParent = async (req, res) => {
    try {
        const { childSchoolId, password } = req.body;

        
        const parent = await Parent.findOne({ childSchoolId });
        if (!parent) {
            return res.status(400).json({ message: "Invalid child school ID or password." });
        }

        const isPasswordMatch = await bcrypt.compare(password, parent.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid child school ID or password." });
        }

        const token = jwt.sign({ parentId: parent._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", parentId: parent._id, name: parent.name , token});
    } catch (error) {
        res.status(500).json({ message: "Error logging in parent", error: error.message });
    }
};

//solving problem 3
exports.updateParentDetails = async (req, res) => {
    try {
        const { grade, section, community } = req.body;
        const parentId = req.parentId;

        const parent = await Parent.findById(parentId);
        if (!parent) {
            return res.status(404).json({ message: "Parent not found." });
        }

        if (grade) parent.grade = grade;
        if (section) parent.section = section;
        if (community !== undefined) parent.community = community;

        await parent.save();

        const circlesToCreate = [
            { name: `${parent.schoolName}`, discoverability: true },
            { name: `Class ${parent.grade}, ${parent.schoolName}`, discoverability: true },
            { name: `Section ${parent.section}, Class ${parent.grade}, ${parent.schoolName}`, discoverability: true }
        ];

        if (community) {
            circlesToCreate.push(
                { name: community, discoverability: true },
                { name: `${community}, ${parent.schoolName}`, discoverability: true }
            );
        }

        const findOrCreateCircle = async (circleData) => {
            let circle = await Circle.findOne({ name: circleData.name });
            if (!circle) {
                circle = new Circle({
                    name: circleData.name,
                    type: "auto-joined",
                    discoverability: circleData.discoverability
                });
                await circle.save();
            }

            if (!circle.members.includes(parent._id)) {
                circle.members.push(parent._id);
                await circle.save();
            }

            return { circleId: circle._id, circleName: circle.name, discoverability: circleData.discoverability };
        };

        const circleDetails = await Promise.all(circlesToCreate.map(findOrCreateCircle));
        const uniqueCirclesMap = new Map();

        if (parent.socialCircles) {
            parent.socialCircles.forEach(circle => {
                uniqueCirclesMap.set(circle.circleId.toString(), circle); 
            });
        }

    
        circleDetails.forEach(circle => {
            uniqueCirclesMap.set(circle.circleId.toString(), circle);
        });

        parent.socialCircles = Array.from(uniqueCirclesMap.values());
        await parent.save();

        res.status(200).json({
            message: "Parent details updated successfully",
            updatedParent: {
                id: parent._id,
                grade: parent.grade,
                section: parent.section,
                community: parent.community,
                socialCircles: parent.socialCircles
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating parent details", error: error.message });
    }
};








