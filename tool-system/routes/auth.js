const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Admin creates a Mechanic
router.post('/register-mechanic', async (req, res) => {
    try {
        const { name, email, mobile, password, level } = req.body;

        // 1. Password Validation: Alphanumeric + 1 Special Char
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ msg: "Password must be alphanumeric with 1 special character" });
        }

        // 2. Mobile Length Validation (Requirement B.2)
        if (!mobile || mobile.length !== 10) {
            return res.status(400).json({ msg: "Mobile No must be exactly 10 characters" });
        }

        // 3. Email Uniqueness Check (Requirement B.2)
        let emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ msg: "Email already exists" });

        // 4. Mobile Uniqueness Check (Requirement B.2)
        let mobileExists = await User.findOne({ mobile });
        if (mobileExists) return res.status(400).json({ msg: "Mobile number already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newMechanic = new User({
            name, 
            email, 
            mobile, 
            password: hashedPassword, 
            level, 
            role: 'Mechanic'
        });

        await newMechanic.save();
        res.status(201).json({ msg: "Mechanic created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error during registration" });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        res.json({ 
            token: "fake-jwt-token", 
            user: { id: user._id, name: user.name, role: user.role } 
        });
    } catch (err) {
        res.status(500).json({ msg: "Server Error during login" });
    }
});

module.exports = router;