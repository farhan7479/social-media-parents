
const jwt = require('jsonwebtoken');

const authenticateParent = (req, res, next) => {
    try {
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided, authorization denied" });
        }

        const token = authHeader.split(' ')[1];

        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token, authorization denied" });
            }

            
            req.parentId = decoded.parentId;
            console.log(req.parentId);
            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = authenticateParent;
