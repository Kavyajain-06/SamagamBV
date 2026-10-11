
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    // Check whether the Authorization header exists.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Authentication token is required.'
        });
    }

    // Extract the token after "Bearer ".
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Make the authenticated user's information available to the route.
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired authentication token.'
        });
    }
}

module.exports = authenticateToken;
