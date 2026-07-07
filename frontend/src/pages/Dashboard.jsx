import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        <div className="card">
          <p>Welcome, {user?.name}! This is the manager dashboard.</p>
          <p>Team reports, filters, and charts will go here next.</p>
        </div>
      </div>
    </div>
  );
}
