const express = require("express");
const {
  getMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
} = require("../controllers/measurement.controller");

const router = express.Router();

const { protect } = require("../../../middlewares/auth.middleware");

// All routes are protected
router.use(protect);

router.route("/")
  .get(getMeasurements)
  .post(createMeasurement);

router.route("/:id")
  .put(updateMeasurement)
  .delete(deleteMeasurement);

module.exports = router;
