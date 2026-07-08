const express = require("express");
const { body } = require("express-validator");
const { register, login, getTeamMembers } = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.get("/team-members", protect, authorizeRoles("manager"), getTeamMembers);

module.exports = router;
