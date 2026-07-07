import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyReports() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
        <div className="card">
          <p>Welcome, {user?.name}! This is your personal weekly report page.</p>
          <p>Report form and history will go here next.</p>
        </div>
      </div>
    </div>
  );
}
