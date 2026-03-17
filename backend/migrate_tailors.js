const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./src/models/Product');
const TailorWorkSample = require('./src/models/TailorWorkSample');
const Tailor = require('./src/models/Tailor');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const tailors = await Tailor.find();
        console.log(`Found ${tailors.length} tailors`);
        
        for (const tailor of tailors) {
            // Update Products where tailor field matches tailor.user (old style)
            const pRes = await Product.updateMany(
                { tailor: tailor.user },
                { $set: { tailor: tailor._id } }
            );
            if (pRes.modifiedCount > 0) {
                console.log(`Migrated ${pRes.modifiedCount} products for tailor ${tailor.shopName}`);
            }
            
            // Update WorkSamples
            const wRes = await TailorWorkSample.updateMany(
                { tailor: tailor.user },
                { $set: { tailor: tailor._id } }
            );
            if (wRes.modifiedCount > 0) {
                console.log(`Migrated ${wRes.modifiedCount} work samples for tailor ${tailor.shopName}`);
            }
        }
        
        console.log('Migration complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
