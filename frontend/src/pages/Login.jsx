import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "manager") {
        navigate("/dashboard");
      } else {
        navigate("/my-reports");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 🎨 මුළු පිටුවේම background එක ලස්සන මෘදු නිල්-අළු පාටකට හැරෙව්වා
    <div style={{
      background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "inherit"
    }}>
      
      {/* ⬜ Clean Login Card with soft shadows */}
      <div style={{
        background: "white",
        padding: "2.5rem",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
        width: "100%",
        maxWidth: "400px"
      }}>
        
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "1.5rem", 
          color: "#111827",
          fontWeight: "700"
        }}>Login</h2>
        
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
              required
              style={{
                padding: "0.7rem",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                outline: "none"
              }}
              placeholder="Enter your password"
            />
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <p style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "14px",
          color: "#4b5563"
        }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ 
            color: "#111827", 
            fontWeight: "600",
            textDecoration: "none",
            borderBottom: "1px solid #111827"
          }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}