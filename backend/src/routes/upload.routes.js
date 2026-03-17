const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");
const upload = require("../middlewares/upload.middleware");
const { protect } = require("../middlewares/auth.middleware");

// Helper to get base URL
const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

// Generic upload handler
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a file" });
    }

    // Try Cloudinary if keys look even slightly real
    if (process.env.CLOUDINARY_API_KEY && !process.env.CLOUDINARY_API_KEY.includes('your_')) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "tailor_platform",
        });
        if (result && result.secure_url) {
          return res.status(200).json({ success: true, data: result.secure_url });
        }
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed:", cloudErr.message);
      }
    }

    // Local Fallback
    const localUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      data: localUrl,
    });
  } catch (error) {
    console.error("Critical Upload Error:", error);
    res.status(500).json({ success: false, message: "Upload failed: " + error.message });
  }
});

// Public upload handler
router.post("/public", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a file" });
    }

    if (process.env.CLOUDINARY_API_KEY && !process.env.CLOUDINARY_API_KEY.includes('your_')) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "registration_docs",
        });
        if (result && result.secure_url) {
          return res.status(200).json({ success: true, data: result.secure_url });
        }
      } catch (cloudErr) {
        console.warn("Cloudinary public upload failed:", cloudErr.message);
      }
    }

    const localUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      data: localUrl,
    });
  } catch (error) {
    console.error("Critical Public Upload Error:", error);
    res.status(500).json({ success: false, message: "Upload failed: " + error.message });
  }
});

module.exports = router;
