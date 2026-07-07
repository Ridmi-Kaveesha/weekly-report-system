import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wraps a page and only renders it if the user is logged in
// (and, optionally, has the required role)
export default function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Logged in, but wrong role — send them to their own home page
    return <Navigate to={user.role === "manager" ? "/dashboard" : "/my-reports"} replace />;
  }

  return children;
}
