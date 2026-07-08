const express = require("express");
const { protect, authorizeRoles } = require("../middleware/auth");
const {
  reportValidationRules,
  handleValidation,
} = require("../middleware/validators");
const {
  createReport,
  updateReport,
  getMyReports,
  getAllReports,
} = require("../controllers/reportController");

const router = express.Router();

// Team member: create and edit their own reports
router.post(
  "/",
  protect,
  authorizeRoles("team_member"),
  reportValidationRules,
  handleValidation,
  createReport
);
router.put(
  "/:id",
  protect,
  authorizeRoles("team_member"),
  reportValidationRules,
  handleValidation,
  updateReport
);
router.get("/my", protect, authorizeRoles("team_member"), getMyReports);

// Manager: view all reports across the team, with filters
router.get("/", protect, authorizeRoles("manager"), getAllReports);

module.exports = router;
