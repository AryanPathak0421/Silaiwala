const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a banner title"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    badge: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please provide a banner image"],
    },
    targetLocation: {
      type: String,
      enum: ["Home Page - Top Carousel", "Store Tab - Header Banner", "Promotional Popup"],
      default: "Home Page - Top Carousel",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Scheduled"],
      default: "Active",
    },
    color: {
      type: String,
      default: "bg-gradient-to-br from-[#1e3932] to-[#2d5246]", // frontend class reference
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Banner", bannerSchema);
