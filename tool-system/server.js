const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
const Tool = require('./models/Tool'); 

dotenv.config();
const app = express();
app.use(express.json()); 
app.use(cors());
app.use(express.static('public'));


// --- D.1: Unified Login Route ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        res.json({ user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ msg: "Server Error" });
    }
});

// --- B.5 & C.1: Report & Inventory Routes ---
app.get('/api/admin/mechanics', async (req, res) => {
    try {
        const mechanics = await User.find({ role: 'Mechanic' });
        res.json(mechanics);
    } catch (err) { res.status(500).json({ msg: "Fetch Error" }); }
});

app.get('/api/admin/tools', async (req, res) => {
    try {
        const tools = await Tool.find();
        res.json(tools);
    } catch (err) { res.status(500).json({ msg: "Fetch Error" }); }
});

// --- B.1 & B.2: Mechanic Registration ---
app.post('/api/auth/register-mechanic', async (req, res) => {
    try {
        const { name, email, mobile, password, level, picture } = req.body;
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
        if (!passwordRegex.test(password)) return res.status(400).json({ msg: "Alphanumeric + Special Char required" });
        if (mobile.length !== 10) return res.status(400).json({ msg: "10 Digit Mobile required" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newMechanic = new User({ name, email, mobile, password: hashedPassword, level, picture, role: 'Mechanic' });
        await newMechanic.save();
        res.status(201).json({ msg: "Mechanic Registered" });
    } catch (err) { res.status(500).json({ msg: "Duplicate Entry Error" }); }
});

// --- B.4 & C.3: Issue & Return Logic ---
app.post('/api/tools/issue', async (req, res) => {
    try {
        const { toolId, qtyIssued } = req.body;
        const tool = await Tool.findById(toolId);
        if (!tool || tool.quantity < qtyIssued) return res.status(400).json({ msg: "Stock Low" });
        tool.quantity -= qtyIssued;
        await tool.save();
        res.json({ msg: "Issued Successfully" });
    } catch (err) { res.status(500).json({ msg: "Issue Error" }); }
});

app.post('/api/tools/return', async (req, res) => {
    try {
        const { toolId, qtyReturned } = req.body;
        const tool = await Tool.findById(toolId);
        tool.quantity += parseInt(qtyReturned);
        await tool.save();
        res.json({ msg: "Returned Successfully" });
    } catch (err) { res.status(500).json({ msg: "Return Error" }); }
});

mongoose.connect(process.env.MONGO_URI).then(() => console.log("✅ DB Connected"));
app.listen(5000, () => console.log("🚀 Server running on Port 5000"));