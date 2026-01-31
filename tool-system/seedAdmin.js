const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); //
require('dotenv').config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("Admin@123", salt);

        const admin = new User({
            name: "Super Admin",
            email: "admin@system.com",
            mobile: "1234567899", // Must be unique
            password: hashedPassword,
            role: "Admin", // Necessary for Admin Panel access
            level: "Expert"
        });

        await admin.save();
        console.log("✅ Admin user created successfully!");
        console.log("Email: admin@system.com | Password: Admin@123");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
};

seed();