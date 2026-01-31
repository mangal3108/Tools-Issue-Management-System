const express = require('express');
const router = express.Router();
const Tool = require('../models/Tool');

// Add Tool
router.post('/add', async (req, res) => {
    try {
        const { title, category, quantity } = req.body;
        const newTool = new Tool({ title, category, quantity });
        await newTool.save();
        res.json({ msg: "Tool added" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;