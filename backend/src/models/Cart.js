const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        quantity: { type: Number, default: 1 },
        price: Number,
        config: {
          size: String,
          color: String,
          fabricSource: String,
          deliveryType: String,
          measurements: Map,
        }
      },
    ],
    totalAmount: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save to calculate totalAmount
cartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
