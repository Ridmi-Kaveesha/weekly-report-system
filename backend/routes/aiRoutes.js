const express = require("express");
const { protect, authorizeRoles } = require("../middleware/auth");
const { chatWithAssistant, generateTeamSummary } = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", protect, authorizeRoles("manager"), chatWithAssistant);
router.post("/summary", protect, authorizeRoles("manager"), generateTeamSummary);

module.exports = router;
