import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../api/projects";
import { createReport, updateReport, getMyReports } from "../api/reports";
import ReportForm from "../components/ReportForm";
import ReportHistory from "../components/ReportHistory";

export default function MyReports() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [projectsRes, reportsRes] = await Promise.all([
        getProjects(),
        getMyReports(),
      ]);
      setProjects(projectsRes.data);
      setReports(reportsRes.data);
    } catch (err) {
      setError("Failed to load data. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (formData, status, reportId) => {
    const payload = { ...formData, status };
    if (reportId) {
      await updateReport(reportId, payload);
    } else {
      await createReport(payload);
    }
    setEditingReport(null);
    await loadData();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div className="navbar">
        <h1>Weekly Reports — {user?.name}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="container">
        {error && <p className="error-text">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {projects.length === 0 && (
              <div className="card">
                <p>
                  No projects available yet. Ask your manager to create a project
                  before submitting a report.
                </p>
              </div>
            )}
            <ReportForm
              projects={projects}
              onSubmit={handleSubmit}
              editingReport={editingReport}
              onCancelEdit={() => setEditingReport(null)}
            />
            <ReportHistory reports={reports} onEdit={setEditingReport} />
          </>
        )}
      </div>
    </div>
  );
}
