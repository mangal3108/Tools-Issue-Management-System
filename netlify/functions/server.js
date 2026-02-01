const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('../../tool-system/models/User');
const Tool = require('../../tool-system/models/Tool');

const app = express();
app.use(express.json());
app.use(cors());

// --- Auth ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    res.json({ user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// --- Register Mechanic ---
app.post('/api/auth/register-mechanic', async (req, res) => {
  try {
    const { name, email, mobile, password, level, picture } = req.body;
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if (!passwordRegex.test(password)) return res.status(400).json({ msg: 'Alphanumeric + Special Char required' });
    if (mobile.length !== 10) return res.status(400).json({ msg: '10 Digit Mobile required' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newMechanic = new User({ name, email, mobile, password: hashedPassword, level, picture, role: 'Mechanic' });
    await newMechanic.save();
    res.status(201).json({ msg: 'Mechanic Registered' });
  } catch (err) { res.status(500).json({ msg: 'Duplicate Entry Error' }); }
});

// --- Add Tool ---
app.post('/api/tools/add', async (req, res) => {
  try {
    const { title, category, quantity, image } = req.body;
    const newTool = new Tool({ title, category, quantity, image });
    await newTool.save();
    res.status(201).json({ msg: 'Tool added' });
  } catch (err) { res.status(500).json({ msg: 'Add Tool Error' }); }
});

// --- Report & Inventory ---
app.get('/api/admin/mechanics', async (req, res) => {
  try {
    const mechanics = await User.find({ role: 'Mechanic' });
    res.json(mechanics);
  } catch (err) { res.status(500).json({ msg: 'Fetch Error' }); }
});

app.get('/api/admin/tools', async (req, res) => {
  try {
    const tools = await Tool.find();
    res.json(tools);
  } catch (err) { res.status(500).json({ msg: 'Fetch Error' }); }
});

// --- Issue & Return ---
app.post('/api/tools/issue', async (req, res) => {
  try {
    const { toolId, qtyIssued } = req.body;
    const tool = await Tool.findById(toolId);
    if (!tool || tool.quantity < qtyIssued) return res.status(400).json({ msg: 'Stock Low' });
    tool.quantity -= qtyIssued;
    await tool.save();
    res.json({ msg: 'Issued Successfully' });
  } catch (err) { res.status(500).json({ msg: 'Issue Error' }); }
});

app.post('/api/tools/return', async (req, res) => {
  try {
    const { toolId, qtyReturned } = req.body;
    const tool = await Tool.findById(toolId);
    tool.quantity += parseInt(qtyReturned);
    await tool.save();
    res.json({ msg: 'Returned Successfully' });
  } catch (err) { res.status(500).json({ msg: 'Return Error' }); }
});

// Mongoose connection reuse (avoid reconnect on warm invocations)
const handler = serverless(app);

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (mongoose.connection.readyState === 0) {
    // Connect if not already connected
    await mongoose.connect(process.env.MONGO_URI, {
      // options are optional with recent mongoose versions
    });
    console.log('✅ DB Connected');
  }
  return handler(event, context);
};
