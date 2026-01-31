const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
});

module.exports = mongoose.model('Tool', ToolSchema);