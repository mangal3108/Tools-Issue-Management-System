const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mechanicName: String,
    toolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
    toolTitle: String,
    quantity: { type: Number, required: true },
    dateIssued: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', IssueSchema);