const Circle = require('../models/circleSchema'); 
const Parent = require('../models/parentSchema.js');
const mongoose = require('mongoose');
// Create a new circle by Parent(user)
exports.createCircle = async (req, res) => {
    try {
        const { name, type, discoverability, parentCircleId } = req.body;
        const parentId = req.parentId; // Assuming this is set by middleware
        
        // Create a new circle instance
        const newCircle = new Circle({
            name,
            type,
            discoverability,
            members: [parentId], // Add the parent as a member
            parentCircle: parentCircleId ? parentCircleId : undefined // Only add if there's a parentCircleId
        });

        // Save the new circle to the database
        const savedCircle = await newCircle.save();

        // If there's a parent circle, update its subCircles
        if (parentCircleId) {
            await Circle.findByIdAndUpdate(
                parentCircleId,
                { $addToSet: { subCircles: savedCircle._id } },
                { new: true }
            );
        }

        // Update the parent document to include this circle in `socialCircles`
        await Parent.findByIdAndUpdate(
            parentId,
            {
                $addToSet: {
                    socialCircles: {
                        circleId: savedCircle._id,
                        circleName: savedCircle.name,
                        discoverability: savedCircle.discoverability,
                    }
                }
            },
            { new: true }
        );

        return res.status(201).json({
            message: 'Circle created successfully',
            circle: savedCircle
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error creating circle',
            error: error.message
        });
    }
};


exports.getParentWithCircles = async (req, res) => {
    try {
        const parentId = req.parentId;

        // Fetch the parent with social circles and populate nested circles recursively
        const parent = await Parent.findById(parentId)
            .populate({
                path: 'socialCircles.circleId', 
                populate: {
                    path: 'subCircles', 
                    
                }
            });

        if (!parent) {
            return res.status(404).json({ message: 'Parent not found' });
        }

        res.status(200).json({ parent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving parent with circles', error: error.message });
    }
};

// Retrieve all circles, showing joined and relevant circles at the top
exports.getAllCircles = async (req, res) => {
    try {
        const parentId = req.parentId; // Assume this is set by authentication middleware

        // 1. Fetch circles the parent has joined
        const parent = await Parent.findById(parentId).populate('socialCircles.circleId');
        const joinedCircles = parent.socialCircles.map(circle => circle.circleId);
        const joinedCircleIds = joinedCircles.map(circle => circle._id); // Get joined circle IDs

        // 2. Get names of joined circles to match similar circles
        const joinedCircleNames = joinedCircles.map(circle => circle.name);

        // 3. Find partially matching circles (not joined but similar to joined circles)
        const suggestedCircles = await Circle.find({
            name: { $regex: joinedCircleNames.join('|'), $options: 'i' },
            _id: { $nin: joinedCircleIds } // Ensure these are not already joined
        });

        // 4. Fetch all other circles that the parent has not joined
        const otherCircles = await Circle.find({
            _id: { $nin: joinedCircleIds.concat(suggestedCircles.map(circle => circle._id)) } // Exclude joined and suggested circles
        });

        // 5. Combine results with suggested circles on top, then other circles
        const allCircles = [...suggestedCircles, ...otherCircles];

        res.status(200).json({
            message: 'Circles retrieved successfully',
            circles: allCircles,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error retrieving circles',
            error: error.message,
        });
    }
};


// Join a suggested circle
exports.joinCircle = async (req, res) => {
    try {
        const parentId = req.parentId; // Assume this is set by authentication middleware
        const { circleId } = req.body; // Circle ID to join

        // 1. Find the circle by ID
        const circle = await Circle.findById(circleId);
        if (!circle) {
            return res.status(404).json({
                message: 'Circle not found',
            });
        }

        // 2. Find the parent by ID
        const parent = await Parent.findById(parentId);
        if (!parent) {
            return res.status(404).json({
                message: 'Parent not found',
            });
        }

        // 3. Check if the parent is already a member of the circle
        if (circle.members.includes(parentId)) {
            return res.status(400).json({
                message: 'You are already a member of this circle',
            });
        }

        // 4. Add circle to parent's socialCircles
        parent.socialCircles.push({
            circleId: circle._id,
            circleName: circle.name,
            discoverability: circle.discoverability,
        });
        await parent.save();

        // 5. Add parent to the circle's members
        circle.members.push(parentId);
        await circle.save();

        return res.status(200).json({
            message: 'Successfully joined the circle',
            circleId: circle._id,
            circleName: circle.name,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error joining circle',
            error: error.message,
        });
    }
};