const express = require("express");
const { protect, authorizeRoles } = require("../middleware/auth");
const {
  createReport,
  updateReport,
  getMyReports,
  getAllReports,
} = require("../controllers/reportController");

const router = express.Router();

// Team member: create and edit their own reports
router.post("/", protect, authorizeRoles("team_member"), createReport);
router.put("/:id", protect, authorizeRoles("team_member"), updateReport);
router.get("/my", protect, authorizeRoles("team_member"), getMyReports);

// Manager: view all reports across the team, with filters
router.get("/", protect, authorizeRoles("manager"), getAllReports);

module.exports = router;
