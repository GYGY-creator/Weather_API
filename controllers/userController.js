// controllers/userController.js

// Import required modules
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

/*
    Method: Register
    Purpose: Register a new user in the system.
    Notes:
    - Generates a temporary password hash because model requires it.
    - Stores optional fields (phone, address).
*/

async function Register(req, res)
{
    try
    {
        const username = req.body.username;
        const password = req.body.password;
        const email    = req.body.email;
        const phone    = req.body.phone || null;
        const address  = req.body.address || null;

        // Validate input
        if (!username || !password || !email)
        {
            return res.status(400).json({
                error : 'Username, password, and email are required.'
            });
        }

        // Username exists?
        const existingUsername = await UserModel.Model.findOne({
            where : { username : username }
        });

        if (existingUsername)
        {
            return res.status(409).json({
                error : "Username already exists."
            });
        }

        // Email exists?
        const existingEmail = await UserModel.Model.findOne({
            where : { email : email }
        });

        if (existingEmail)
        {
            return res.status(409).json({
                error : "Email is already registered."
            });
        }

        // Phone exists? (optional)
        if (phone)
        {
            const existingPhone = await UserModel.Model.findOne({
                where : { phone : phone }
            });

            if (existingPhone)
            {
                return res.status(409).json({
                    error : "Phone number is already registered."
                });
            }
        }

        // Hash raw password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await UserModel.Create(
        {
            username       : username,
            password_hash  : hashedPassword,
            email          : email,
            phone          : phone,
            address        : address
        });

        return res.status(200).json(
        {
            message : 'User registered successfully.',
            user    : newUser
        });
    }
    catch (error)
    {
        console.error('Error in Register:', error);
        return res.status(500).json({ error : 'Internal server error.' });
    }
}

async function Login(req, res)
{
    try 
    {
        const username = req.body.username;
        const password = req.body.password;

        // Validate input
        if (!username || !password)
        {
            return res.status(400).json(
            {
                error : 'Username and password are required.'
            });
        }

        // Load user with password hash
        const user = await UserModel.Model.scope('withPassword').findOne(
        {
            where : { username : username }
        });

        if (!user)
        {
            return res.status(404).json(
            {
                error : 'User not found.'
            });
        }

        // Compare password
        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatches)
        {
            return res.status(401).json(
            {
                error : 'Invalid password.'
            });
        }

        // Load RSA private key
        const fs = require('fs');
        const jwt = require('jsonwebtoken');
        const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');

        // Build JWT payload from database user info
        const payload = {
            sub: user.id,
            name: user.username,
            role: user.role
        };

        // Create RSA-signed JWT
        const token = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        });

        // Successful login response
        return res.status(200).json({
            message: "Login successful.",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email
            }
        });

    }
    catch (error)
    {
        console.error('Error in Login:', error);
        return res.status(500).json(
        {
            error : 'Internal server error.'
        });
    }
}

// to do GetProfile


// to do UpdateProfile


// to do ChangePassword

module.exports = 
{
    Register,
    Login
};
