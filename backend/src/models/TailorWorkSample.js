const mongoose = require("mongoose");

const tailorWorkSampleSchema = new mongoose.Schema(
  {
    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tailor",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please add a title for your work sample"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    image: {
      type: String,
      required: [true, "Please add an image of your work"],
    },
    serviceType: {
      type: String,
      required: true,
      default: "STITCHING",
      enum: ["STITCHING", "ALTERATION", "DESIGNING", "EMBROIDERY"],
    },
    tags: [
      {
        type: String,
      },
    ],
    laborPrice: {
      type: Number,
      required: [true, "Please add a price for your service"],
    },
    avgCompletionTime: {
      type: String,
      required: [true, "Please specify average completion time (e.g., 2 DAYS)"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select a category"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries per tailor
tailorWorkSampleSchema.index({ tailor: 1, isActive: 1 });

module.exports = mongoose.model("TailorWorkSample", tailorWorkSampleSchema);
