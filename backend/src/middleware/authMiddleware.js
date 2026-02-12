const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies JWT token from Authorization header
 * Attaches decoded user data to req.user
 */
exports.authenticate = async (req, res, next) => {
    try {
        // 1. Extract token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Get token (format: "Bearer <token>")
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Invalid token format.'
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach decoded data to request object
        req.user = decoded;

        // Proceed to next middleware/route handler
        next();

    } catch (err) {
        console.error('Authentication Error:', err.message);

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.'
            });
        }

        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Authentication failed.'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

/**
 * Role-Based Access Control Middleware
 * Restricts access based on user role
 * Must be used after authenticate middleware
 * 
 * @param  {...string} allowedRoles - Roles allowed to access the route
 */
exports.authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if user exists (should be set by authenticate middleware)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. User not authenticated.'
            });
        }

        // Check if user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        // User has required role, proceed
        next();
    };
};
