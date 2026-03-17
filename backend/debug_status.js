const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

async function debugUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ name: /Mayur/i });
        if (user) {
            console.log('User found:', JSON.stringify(user, null, 2));
            // Force it to pending for testing if requested
            user.isActive = false;
            await user.save();
            console.log('User status updated to isActive: false');
        } else {
            console.log('No user found with name Mayur');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugUser();
