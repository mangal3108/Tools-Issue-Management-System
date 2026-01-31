const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true, maxlength: 10 },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Mechanic'], default: 'Mechanic' },
    level: { type: String, enum: ['Expert', 'Medium', 'New Recruit', 'Trainee'] },
    picture: { type: String }
});

module.exports = mongoose.model('User', UserSchema);