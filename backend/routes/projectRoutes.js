const express = require("express");
const { protect, authorizeRoles } = require("../middleware/auth");
const {
  projectValidationRules,
  handleValidation,
} = require("../middleware/validators");
const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

// Any logged-in user can view the list of projects (needed for report form dropdown)
router.get("/", protect, getProjects);

// Only managers can create, edit, or delete projects
router.post(
  "/",
  protect,
  authorizeRoles("manager"),
  projectValidationRules,
  handleValidation,
  createProject
);
router.put(
  "/:id",
  protect,
  authorizeRoles("manager"),
  projectValidationRules,
  handleValidation,
  updateProject
);
router.delete("/:id", protect, authorizeRoles("manager"), deleteProject);

module.exports = router;
