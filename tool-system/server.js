const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); 
const Tool = require('./models/Tool'); 
const Issue = require('./models/Issue'); 

dotenv.config();
const app = express();

app.use(cors({ origin: 'https://timsbymangal.netlify.app', credentials: true }));
app.use(express.json());
app.use(express.static('public'));

// --- LOGIN ---
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
        
        // Return ID, Name, and Role for frontend display
        res.json({ user: { id: user._id, name: user.name, role: user.role } });
    } catch (err) { res.status(500).json({ msg: "Server Error" }); }
});

// --- ADMIN: REGISTER MECHANIC (B.1 & B.2) ---
app.post('/api/auth/register-mechanic', async (req, res) => {
    try {
        const { name, email, mobile, password, level, picture } = req.body;
        
        // Password Validation: Alphanumeric + Special Char
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ msg: "Password: Alphanumeric + Special Char required (Min 6)" });
        }
        
        if (mobile.length !== 10) return res.status(400).json({ msg: "10 Digit Mobile required" });
        
        const existing = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existing) return res.status(400).json({ msg: "Email or Mobile already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newMech = new User({ 
            name, email, mobile, password: hashedPassword, 
            level, picture, role: 'Mechanic' 
        });
        
        await newMech.save();
        res.status(201).json({ msg: "Mechanic Registered" });
    } catch (err) { res.status(500).json({ msg: "Server Error" }); }
});

// --- ADMIN: ADD TOOLS (B.3) ---
app.post('/api/tools/add', async (req, res) => {
    try {
        const { title, category, quantity, image } = req.body;
        const newTool = new Tool({ 
            title, 
            category, 
            quantity: parseInt(quantity), 
            image 
        });
        await newTool.save();
        res.status(201).json({ msg: "Tool Added Successfully" });
    } catch (err) { res.status(500).json({ msg: "Add Error" }); }
});

// --- ADMIN: ISSUE TOOL (B.4) ---
app.post('/api/tools/issue', async (req, res) => {
    try {
        const { toolId, mechanicId, qtyIssued } = req.body;
        const tool = await Tool.findById(toolId);
        const user = await User.findById(mechanicId);
        const amount = parseInt(qtyIssued);

        if (!tool || tool.quantity < amount) return res.status(400).json({ msg: "Stock Low" });

        // Decrease Inventory
        tool.quantity -= amount;
        await tool.save();

        // Create Issue Record with Timestamp
        const newIssue = new Issue({ 
            mechanicId: user._id, 
            mechanicName: user.name, 
            toolId: tool._id, 
            toolTitle: tool.title, 
            quantity: amount,
            dateIssued: new Date() // Feature: Added Timestamp
        });
        await newIssue.save();
        
        res.json({ msg: "Issued Successfully" });
    } catch (err) { res.status(500).json({ msg: "Issue Error" }); }
});

// --- MECHANIC: RETURN TOOL (C.3) ---
app.post('/api/tools/return', async (req, res) => {
    try {
        const { issueId } = req.body;
        const issue = await Issue.findById(issueId);
        if (!issue) return res.status(404).json({ msg: "Record not found" });

        const tool = await Tool.findById(issue.toolId);
        tool.quantity += issue.quantity;
        
        await tool.save();
        await Issue.findByIdAndDelete(issueId);
        
        res.json({ msg: "Returned Successfully" });
    } catch (err) { res.status(500).json({ msg: "Return Error" }); }
});

// --- DATA ROUTES (B.5 Issued Tools Report) ---
app.get('/api/admin/mechanics', async (req, res) => { 
    res.json(await User.find({ role: 'Mechanic' })); 
});

app.get('/api/admin/tools', async (req, res) => { 
    res.json(await Tool.find()); 
});

app.get('/api/admin/all-issues', async (req, res) => { 
    res.json(await Issue.find().sort({ dateIssued: -1 })); 
});

app.get('/api/mechanic/custody/:id', async (req, res) => { 
    res.json(await Issue.find({ mechanicId: req.params.id }).sort({ dateIssued: -1 })); 
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("✅ DB Connected");
    app.listen(PORT, () => console.log(`🚀 Running on Port ${PORT}`));
});