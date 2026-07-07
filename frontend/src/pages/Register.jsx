import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("team_member");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(name, email, password, role);
      if (user.role === "manager") {
        navigate("/dashboard");
      } else {
        navigate("/my-reports");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🎨 Theme: Soft Slate/Ice Blue Background
    <div style={{
      background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "inherit",
      padding: "2rem 0"
    }}>
      
      {/* ⬜ Clean Register Card */}
      <div style={{
        background: "white",
        padding: "2.5rem",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
        width: "100%",
        maxWidth: "420px"
      }}>
        
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "1.5rem", 
          color: "#111827",
          fontWeight: "700"
        }}>Create Account</h2>
        
        {error && (
          <p style={{
            color: "#991b1b",
            background: "#fee2e2",
            padding: "0.6rem",
            borderRadius: "6px",
            fontSize: "14px",
            textAlign: "center",
            fontWeight: "500",
            marginBottom: "1rem"
          }}>{error}</p>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontWeight: "500", color: "#374151", fontSize: "14px" }}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                padding: "0.7rem",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                outline: "none"
              }}
              placeholder="Enter your full name"
            />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontWeight: "500", color: "#374151", fontSize: "14px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "0.7rem",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                outline: "none"
              }}
              placeholder="Enter your email"
            />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontWeight: "500", color: "#374151", fontSize: "14px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              style={{
                padding: "0.7rem",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                outline: "none"
              }}
              placeholder="Minimum 6 characters"
            />
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label style={{ fontWeight: "500", color: "#374151", fontSize: "14px" }}>Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={{
                padding: "0.7rem",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                background: "white",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="team_member">Team Member</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          
          {/* 🟦 Button - Theme: Deep Navy Blue (#111827) */}
          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: "#111827",
              color: "white",
              border: "none",
              padding: "0.8rem",
              borderRadius: "6px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "0.5rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              transition: "background 0.2s"
            }}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        
        <p style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "14px",
          color: "#4b5563"
        }}>
          Already have an account?{" "}
          <Link to="/login" style={{ 
            color: "#111827", 
            fontWeight: "600",
            textDecoration: "none",
            borderBottom: "1px solid #111827"
          }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}