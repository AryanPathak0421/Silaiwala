require('dotenv').config();
const mongoose = require('mongoose');

// Absolute path to the Order model
const Order = require('./src/models/Order');

async function fixOrders() {
    try {
        const MONGO_URI = "mongodb://mayurchadokar14_db_user:sORqnMJxbSjnstzY@ac-qgfccso-shard-00-00.ueig0du.mongodb.net:27017,ac-qgfccso-shard-00-01.ueig0du.mongodb.net:27017,ac-qgfccso-shard-00-02.ueig0du.mongodb.net:27017/trailor?ssl=true&replicaSet=atlas-ynbk37-shard-0&authSource=admin&retryWrites=true&w=majority";
        await mongoose.connect(MONGO_URI);

        console.log('Connected to MongoDB. Scanning for invalid GeoJSON...');

        // 1. Find orders where location.type exists but location.coordinates does not
        const results = await Order.find({
            'deliveryAddress.location.type': { $exists: true },
            'deliveryAddress.location.coordinates': { $exists: false }
        });

        console.log(`Found ${results.length} documents with invalid GeoJSON structure.`);

        if (results.length > 0) {
            const updateRes = await Order.updateMany(
                {
                    'deliveryAddress.location.type': { $exists: true },
                    'deliveryAddress.location.coordinates': { $exists: false }
                },
                { $unset: { 'deliveryAddress.location': '' } }
            );
            console.log(`Updated ${updateRes.modifiedCount} documents. Removed invalid 'location' fields.`);
        }

        // 2. Also drop the index and recreate it if it still errors.
        try {
            console.log('Dropping existing 2dsphere index on deliveryAddress.location...');
            await Order.collection.dropIndex("deliveryAddress.location_2dsphere");
            console.log('Index dropped. Creating fresh 2dsphere index...');
            await Order.collection.createIndex({ "deliveryAddress.location": "2dsphere" }, { sparse: true });
            console.log('Index successfully created.');
        } catch (e) {
            console.log('Index operation had minor issues (already exists/dropped), proceeding:', e.message);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error fixing orders:', error);
        process.exit(1);
    }
}

fixOrders();
