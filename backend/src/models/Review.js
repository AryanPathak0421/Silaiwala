const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    // Target can be a Product or a Tailor profile
    targetType: {
      type: String,
      required: true,
      enum: ["Product", "Tailor"],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookup by target
reviewSchema.index({ targetId: 1, targetType: 1 });

module.exports = mongoose.model("Review", reviewSchema);
