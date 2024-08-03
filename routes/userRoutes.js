const express = require('express');
const User = require('../models/user');
const { createCustomError } = require('../error/customError');

const router = express.Router();

// POST /signup
router.post('/signup', async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;

        // Basic validation
        if (!username || !email || !password) {
            return next(createCustomError('All fields are required', 400));
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(createCustomError('Email already in use', 409));
        }

        // Create new user
        const user = new User({ username, email, password, role });
        await user.save();

        console.log("User Registered");
        return res.redirect('/login');
    } catch (error) {
        next(error);
    }
});

// POST /login
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return next(createCustomError('Email and password are required', 400));
        }

        // Match email and password
        const token = await User.matchPasswordAndGenerateToken(email, password);
        if (!token) {
            return next(createCustomError('Invalid credentials', 401));
        }

        console.log("User Logged In");
        return res.cookie("token", token, { httpOnly: true }).redirect('/');
    } catch (error) {
        next(error);
    }
});

// GET /logout
router.get('/logout', (req, res) => {
    res.clearCookie("token").redirect('/');
});

module.exports = router;
