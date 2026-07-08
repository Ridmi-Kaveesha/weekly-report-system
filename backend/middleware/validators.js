const { body, validationResult } = require("express-validator");

// Runs after the express-validator body() checks and returns a 400
// with a clean error list if anything failed.
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Validation failed", errors: errors.array() });
  }
  next();
};

const projectValidationRules = [
  body("name").trim().notEmpty().withMessage("Project name is required"),
  body("description").optional().isString(),
];

const reportValidationRules = [
  body("project").notEmpty().withMessage("Project is required"),
  body("weekStartDate").notEmpty().withMessage("Week start date is required").isISO8601().withMessage("Week start date must be a valid date"),
  body("weekEndDate").notEmpty().withMessage("Week end date is required").isISO8601().withMessage("Week end date must be a valid date"),
  body("tasksCompleted").trim().notEmpty().withMessage("Tasks completed is required"),
  body("tasksPlannedNextWeek").trim().notEmpty().withMessage("Tasks planned for next week is required"),
  body("hoursWorked").optional({ checkFalsy: true }).isNumeric().withMessage("Hours worked must be a number"),
];

module.exports = {
  handleValidation,
  projectValidationRules,
  reportValidationRules,
};
