import { useState, useEffect } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await updateProject(editingId, { name, description });
      } else {
        await createProject({ name, description });
      }
      resetForm();
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setName(project.name);
    setDescription(project.description || "");
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    await deleteProject(id);
    await loadProjects();
  };

  return (
    <div className="card">
      <h3>Manage Projects / Categories</h3>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Project name (e.g. Client A)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ flex: 2, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}
        />
        <button className="btn" type="submit" style={{ width: "auto", padding: "10px 20px" }}>
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            className="btn btn-secondary"
            type="button"
            style={{ width: "auto", padding: "10px 20px" }}
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.description || "—"}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button className="btn btn-secondary" onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleDelete(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
