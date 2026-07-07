const Project = require("../models/Project");

// POST /api/projects  (manager only)
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Project.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "A project with this name already exists" });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/projects  (any logged-in user — needed to fill the dropdown on the report form)
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ name: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/projects/:id  (manager only)
const updateProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/projects/:id  (manager only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };
