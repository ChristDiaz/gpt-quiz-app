// /home/christian/gpt-quiz-app/server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const authMiddleware = require('../middleware/authMiddleware'); // 1. Import auth middleware

const router = express.Router();

// Load JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined. Cannot run auth routes.");
    // Consider exiting the process if JWT_SECRET is critical and missing
    // process.exit(1);
}

// --- POST /api/auth/signup ---
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password.' });
    }
    if (password.length < 6) {
         return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Email or username already exists.' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        const userResponse = newUser.toObject();
        delete userResponse.password;

        res.status(201).json({ message: 'User created successfully.', user: userResponse });

    } catch (error) {
        console.error("Signup Error:", error);
        if (error.name === 'ValidationError') {
             const messages = Object.values(error.errors).map(val => val.message);
             return res.status(400).json({ message: messages.join('. ') });
        }
        res.status(500).json({ message: 'Server error during signup.' });
    }
});

// --- POST /api/auth/login ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        // Find user by email. Use .select('+password') if password field has 'select: false' in schema
        const user = await User.findOne({ email }); //.select('+password');

        if (!user) {
             console.log(`Login attempt failed: User not found for email ${email}`);
             return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`Login attempt failed: Incorrect password for email ${email}`);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        if (!JWT_SECRET) {
             console.error("Login Error: JWT_SECRET is missing.");
             return res.status(500).json({ message: 'Server configuration error.' });
        }

        const payload = {
            id: user._id, // User ID for JWT payload
            // username: user.username // Optionally include username
        };

        const token = jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({
            message: 'Login successful.',
            token: token,
            user: { // Send back basic user info
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});


// --- GET /api/auth/me - Get current logged-in user data --- // 2. Add the new route
// This route is protected by the authMiddleware
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // authMiddleware verifies token and attaches user info to req.user
        // Fetch user details using the ID from the token payload, excluding the password
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            // Should not happen if token is valid but user deleted, but good practice to check
            console.log(`Auth /me: User not found for ID ${req.user.id} from valid token.`);
            return res.status(404).json({ message: 'User associated with token not found.' });
        }

        // Send back the user data
        res.status(200).json({ user });

    } catch (error) {
        console.error("Get User (/me) Error:", error);
        res.status(500).json({ message: 'Server error fetching user data.' });
    }
});


module.exports = router; // Ensure router is exported at the end
