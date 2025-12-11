// middleware/auth.js

const fs = require("fs");
const jwt = require("jsonwebtoken");

if (!process.env.PUBLIC_KEY_PATH) {
    throw new Error("PUBLIC_KEY_PATH is missing in .env");
}

const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH, "utf8");

// role hierarchy
const ROLE_LEVEL = {
    user: 1,
    admin: 2,
    superadmin: 3
};

// token verification middleware
function RequireLogin(req, res, next)
{
    // check for authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader)
    {
        return res.status(401).json({ error: 'Authorization header missing.' });
    }

    // check for Bearer token
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer')
    {
        return res.status(401).json({ error: 'Invalid authorization format.' });
    }

    const token = tokenParts[1];
    try
    {
        // verify token
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

        // attach decoded token to request
        req.user = decoded;
        
        // proceed to next middleware or route handler
        next();

    }catch (err)
    {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

function RequireRole(minRole) {
    return function(req, res, next) {

        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        if (ROLE_LEVEL[req.user.role] < ROLE_LEVEL[minRole]) {
            return res.status(403).json({ error: "Forbidden: insufficient privileges" });
        }

        next();
    };
}

module.exports = {
    RequireLogin,
    RequireRole
};