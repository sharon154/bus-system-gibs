const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

//generate token
const requireSignIn = (req, res, next) => {
    console.log("Incoming Request Headers:", req.headers); // Log all incoming headers for debugging

    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("Token:", token); // Log token for debugging

        if (!token) {
            return res.status(401).json({ message: "Authentication required. No token provided." });
        }

        // Verify the token using the secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded; // This will contain `_id` and `role`
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

//admin access
const isAdmin = (req, res, next) => {
    try {
        // req.user will be available because requireSignIn middleware attaches the decoded token to req.user
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        // If the user is an admin, proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(403).json({ message: "Access denied." });
    }

};

module.exports = { requireSignIn, isAdmin };
