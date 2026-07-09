import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllReports } from "../api/reports";
import { getProjects } from "../api/projects";
import { getTeamMembers } from "../api/users";
import SummaryCards from "../components/SummaryCards";
import DashboardCharts from "../components/DashboardCharts";
import ReportFilters from "../components/ReportFilters";
import ReportsTable from "../components/ReportsTable";
import RecentActivity from "../components/RecentActivity";
import ProjectsPage from "./ProjectsPage";
import AIChatWidget from "../components/AIChatWidget";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview"); // overview | projects
  const [reports, setReports] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({ user: "", project: "", startDate: "", endDate: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStaticData = async () => {
    try {
      const [projectsRes, membersRes] = await Promise.all([getProjects(), getTeamMembers()]);
      setProjects(projectsRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      setError("Failed to load projects/members");
    }
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "")
      );
      const res = await getAllReports(cleanFilters);
      setReports(res.data);
    } catch (err) {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaticData();
  }, []);

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <div className="navbar">
        <h1>Team Dashboard — {user?.name} (Manager)</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="container">
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            className={activeTab === "overview" ? "btn" : "btn btn-secondary"}
            style={{ width: "auto", padding: "8px 20px" }}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={activeTab === "projects" ? "btn" : "btn btn-secondary"}
            style={{ width: "auto", padding: "8px 20px" }}
            onClick={() => setActiveTab("projects")}
          >
            Manage Projects
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {activeTab === "projects" ? (
          <ProjectsPage />
        ) : (
          <>
            <ReportFilters
              filters={filters}
              onChange={setFilters}
              projects={projects}
              members={members}
            />
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <SummaryCards reports={reports} />
                <DashboardCharts reports={reports} />
                <RecentActivity reports={reports} />
                <ReportsTable reports={reports} />
              </>
            )}
          </>
        )}
      </div>
      <AIChatWidget />
    </div>
  );
}
