const mongoose = require("mongoose");

// NOTE: This structure is FIXED and identical for every user, as required
// by the assignment. Do not let the frontend add custom fields.
const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
    weekEndDate: {
      type: Date,
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    tasksCompleted: {
      type: String,
      required: true,
    },
    tasksPlannedNextWeek: {
      type: String,
      required: true,
    },
    blockers: {
      type: String,
      default: "",
    },
    hoursWorked: {
      type: Number,
      required: false,
    },
    notesOrLinks: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "late"],
      default: "draft",
    },
    submittedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Helpful for dashboard queries: one report per user per week
reportSchema.index({ user: 1, weekStartDate: 1 }, { unique: true });

module.exports = mongoose.model("Report", reportSchema);
