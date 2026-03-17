const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: String,
    image: String,
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    type: {
      type: String,
      enum: ["product", "service"],
      default: "product",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    basePrice: {
      type: Number,
    },
    deliveryTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
