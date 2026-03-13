const express = require("express");
const router = express.Router();
const { createReview, getReviews } = require("../controllers/review.controller");
const { protect } = require("../../../middlewares/auth.middleware");

router.get("/:targetType/:targetId", getReviews);
router.post("/", protect, createReview);

module.exports = router;
