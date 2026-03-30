const mongoose = require('mongoose');
const Order = require('./src/models/Order');

async function fixStuckOrders() {
    try {
        const MONGO_URI = "mongodb://mayurchadokar14_db_user:sORqnMJxbSjnstzY@ac-qgfccso-shard-00-00.ueig0du.mongodb.net:27017,ac-qgfccso-shard-00-01.ueig0du.mongodb.net:27017,ac-qgfccso-shard-00-02.ueig0du.mongodb.net:27017/trailor?ssl=true&replicaSet=atlas-ynbk37-shard-0&authSource=admin&retryWrites=true&w=majority";
        await mongoose.connect(MONGO_URI);

        console.log('Connected. Scanning for paid but pending orders where fabric pickup is needed...');

        // Sometimes fabricPickupRequired boolean might be missing or set incorrectly. Let's rely on both checks.
        const stuckOrders = await Order.find({
            paymentStatus: 'paid',
            status: 'pending'
        });

        console.log(`Found ${stuckOrders.length} total paid/pending orders.`);

        let updatedCount = 0;
        for (const order of stuckOrders) {
            // Double check if any item needs fabric pickup
            const needsFabric = order.items.some(item => item.fabricSource === 'customer') || order.fabricPickupRequired === true;

            if (needsFabric) {
                order.status = 'fabric-ready-for-pickup';
                await order.save();
                updatedCount++;
            }
        }

        console.log(`Updated ${updatedCount} orders to 'fabric-ready-for-pickup'. These should now appear in the delivery dashboard.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixStuckOrders();
