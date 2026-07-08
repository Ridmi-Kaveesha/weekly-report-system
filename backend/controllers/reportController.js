const Report = require("../models/Report");

// Helper: if a report is still in "draft" status after its week has ended,
// treat it as "late" for display purposes (without permanently changing
// the stored status, so the user can still submit it normally).
const withComputedStatus = (report) => {
  const obj = report.toObject ? report.toObject() : report;
  if (obj.status === "draft" && new Date(obj.weekEndDate) < new Date()) {
    obj.status = "late";
  }
  return obj;
};

// POST /api/reports  (team member creates their own report)
const createReport = async (req, res) => {
  try {
    const {
      project,
      weekStartDate,
      weekEndDate,
      tasksCompleted,
      tasksPlannedNextWeek,
      blockers,
      hoursWorked,
      notesOrLinks,
      status, // "draft" or "submitted"
    } = req.body;

    const report = await Report.create({
      user: req.user.id,
      project,
      weekStartDate,
      weekEndDate,
      tasksCompleted,
      tasksPlannedNextWeek,
      blockers,
      hoursWorked,
      notesOrLinks,
      status: status === "submitted" ? "submitted" : "draft",
      submittedAt: status === "submitted" ? new Date() : null,
    });

    res.status(201).json(report);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already have a report for this week" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/reports/:id  (owner can edit their own report)
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Only the report's owner can edit it
    if (report.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own reports" });
    }

    const fields = [
      "project",
      "weekStartDate",
      "weekEndDate",
      "tasksCompleted",
      "tasksPlannedNextWeek",
      "blockers",
      "hoursWorked",
      "notesOrLinks",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) report[field] = req.body[field];
    });

    // Handle submit action separately
    if (req.body.status === "submitted" && report.status !== "submitted") {
      report.status = "submitted";
      report.submittedAt = new Date();
    }

    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/reports/my  (team member views their own report history)
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id })
      .populate("project", "name")
      .sort({ weekStartDate: -1 });

    res.json(reports.map(withComputedStatus));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/reports  (manager views all reports, with optional filters)
// Query params supported: user, project, startDate, endDate
const getAllReports = async (req, res) => {
  try {
    const { user, project, startDate, endDate } = req.query;
    const filter = {};

    if (user) filter.user = user;
    if (project) filter.project = project;
    if (startDate || endDate) {
      filter.weekStartDate = {};
      if (startDate) filter.weekStartDate.$gte = new Date(startDate);
      if (endDate) filter.weekStartDate.$lte = new Date(endDate);
    }

    const reports = await Report.find(filter)
      .populate("user", "name email")
      .populate("project", "name")
      .sort({ weekStartDate: -1 });

    res.json(reports.map(withComputedStatus));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createReport, updateReport, getMyReports, getAllReports };
