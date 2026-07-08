import { useState, useEffect } from "react";

const emptyForm = {
  project: "",
  weekStartDate: "",
  weekEndDate: "",
  tasksCompleted: "",
  tasksPlannedNextWeek: "",
  blockers: "",
  hoursWorked: "",
  notesOrLinks: "",
};

export default function ReportForm({ projects, onSubmit, editingReport, onCancelEdit }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingReport) {
      setForm({
        project: editingReport.project?._id || editingReport.project,
        weekStartDate: editingReport.weekStartDate?.slice(0, 10),
        weekEndDate: editingReport.weekEndDate?.slice(0, 10),
        tasksCompleted: editingReport.tasksCompleted,
        tasksPlannedNextWeek: editingReport.tasksPlannedNextWeek,
        blockers: editingReport.blockers || "",
        hoursWorked: editingReport.hoursWorked || "",
        notesOrLinks: editingReport.notesOrLinks || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingReport]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (status) => {
    setSaving(true);
    try {
      await onSubmit(form, status, editingReport?._id);
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h3>{editingReport ? "Edit Weekly Report" : "New Weekly Report"}</h3>

      <div className="form-group">
        <label>Project / Category</label>
        <select name="project" value={form.project} onChange={handleChange} required>
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Week Start</label>
          <input
            type="date"
            name="weekStartDate"
            value={form.weekStartDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Week End</label>
          <input
            type="date"
            name="weekEndDate"
            value={form.weekEndDate}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label>Tasks Completed</label>
        <textarea
          name="tasksCompleted"
          rows={3}
          value={form.tasksCompleted}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Tasks Planned for Next Week</label>
        <textarea
          name="tasksPlannedNextWeek"
          rows={3}
          value={form.tasksPlannedNextWeek}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Blockers / Challenges</label>
        <textarea
          name="blockers"
          rows={2}
          value={form.blockers}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Hours Worked (optional)</label>
          <input
            type="number"
            name="hoursWorked"
            value={form.hoursWorked}
            onChange={handleChange}
            min={0}
          />
        </div>
        <div className="form-group" style={{ flex: 2 }}>
          <label>Notes or Links (optional)</label>
          <input
            type="text"
            name="notesOrLinks"
            value={form.notesOrLinks}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          className="btn btn-secondary"
          type="button"
          disabled={saving}
          onClick={() => handleSubmit("draft")}
        >
          Save as Draft
        </button>
        <button
          className="btn"
          type="button"
          disabled={saving}
          onClick={() => handleSubmit("submitted")}
        >
          {saving ? "Saving..." : "Submit Report"}
        </button>
        {editingReport && (
          <button className="btn btn-secondary" type="button" onClick={onCancelEdit}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
