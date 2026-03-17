const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

async function debugUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({ name: /Mayur Chadokar/i });
        console.log('Users found:', JSON.stringify(users, null, 2));
        
        for (const user of users) {
             user.isActive = false;
             await user.save();
             console.log(`User ${user.name} status updated to isActive: false`);
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugUser();
