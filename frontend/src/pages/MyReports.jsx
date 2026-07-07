import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MyReports() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    weekStartDate: "",
    weekEndDate: "",
    project: "", 
    tasksCompleted: "",
    tasksPlannedNextWeek: "",
    blockers: "",
    hoursWorked: "",
    notesOrLinks: "",
    status: "submitted"
  });

  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        const response = await api.get("/reports/my-reports");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchMyReports();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        hoursWorked: formData.hoursWorked ? Number(formData.hoursWorked) : 0
      };
      const response = await api.post("/reports", dataToSend);
      setMessage("🎉 Report submitted successfully!");
      setReports([response.data, ...reports]); 
      setFormData({
        weekStartDate: "", weekEndDate: "", project: "", tasksCompleted: "",
        tasksPlannedNextWeek: "", blockers: "", hoursWorked: "", notesOrLinks: "", status: "submitted"
      });
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error submitting report. Try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    // මුළු පිටුවේම background එක ලස්සන ලා නිල්/සුදු පාටකට හැරෙව්වා (f4f6f9)
    <div style={{ background: "#f4f6f9", minHeight: "100vh" }}>
      
      {/* 🟦 Navbar - Theme: Deep Navy Blue (#111827) */}
      <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 2rem', background: '#111827', color: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontWeight: '600', letterSpacing: '0.5px' }}>Weekly Reports — {user?.name}</h2>
        <button className="logout-btn" onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}>
          Logout
        </button>
      </div>

      <div className="container" style={{ padding: '2.5rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {message && <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '6px', background: message.includes('🎉') ? '#d1fae5' : '#fee2e2', color: message.includes('🎉') ? '#065f46' : '#991b1b', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>{message}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.4fr', gap: '2.5rem' }}>
          
          {/* 📄 1. Submit Report Form */}
          <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#111827', marginTop: 0, borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' }}>Submit Weekly Report</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#374151' }}>Project ID:</label>
                <input type="text" name="project" value={formData.project} onChange={handleChange} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} placeholder="Paste MongoDB Project ID here" />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#374151' }}>Start Date:</label>
                  <input type="date" name="weekStartDate" value={formData.weekStartDate} onChange={handleChange} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#374151' }}>End Date:</label>
                  <input type="date" name="weekEndDate" value={formData.weekEndDate} onChange={handleChange} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#374151' }}>Tasks Completed This Week:</label>
                <textarea name="tasksCompleted" value={formData.tasksCompleted} onChange={handleChange} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', height: '80px', fontSize: '14px', fontFamily: 'inherit' }} placeholder="What did you achieve?" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#374151' }}>Tasks Planned Next Week:</label>
                <textarea name="tasksPlannedNextWeek" value={formData.tasksPlannedNextWeek} onChange={handleChange} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', height: '80px', fontSize: '14px', fontFamily: 'inherit' }} placeholder="What are you planning to do?" />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#374151' }}>Blockers (Optional):</label>
                <input type="text" name="blockers" value={formData.blockers} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} placeholder="Any challenges or blockers?" />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#374151' }}>Hours Worked:</label>
                  <input type="number" name="hoursWorked" value={formData.hoursWorked} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} placeholder="e.g. 20" />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', color: '#374151' }}>Notes/Links (Optional):</label>
                  <input type="text" name="notesOrLinks" value={formData.notesOrLinks} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }} placeholder="PR links or notes" />
                </div>
              </div>

              {/* 🟦 Button හෙවත් වෙනස් කල තද නිල් පාට බටන් එක (#111827) */}
              <button type="submit" style={{ background: '#111827', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                Submit Report
              </button>
            </form>
          </div>

          {/* 📊 2. Report History */}
          <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#111827', marginTop: 0, borderBottom: '2px solid #f3f4f6', paddingBottom: '0.5rem' }}>Your Report History</h3>
            <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
              {reports.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No reports submitted yet.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    {/* Table header එකත් තද නිල් පැත්තට යන ලස්සන soft පාටක් දුන්නා */}
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Week (Start - End)</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Completed Tasks</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Next Week Plan</th>
                      <th style={{ padding: '1rem', color: '#475569', fontWeight: '600' }}>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => (
                      <tr key={report._id} style={{ borderBottom: '1px solid #f1f5f9', transition: '0.2s' }}>
                        <td style={{ padding: '1rem', fontSize: '13px', color: '#334155', fontWeight: '500' }}>
                          {new Date(report.weekStartDate).toLocaleDateString()} - <br/>
                          <span style={{ color: '#64748b' }}>{new Date(report.weekEndDate).toLocaleDateString()}</span>
                        </td>
                        <td style={{ padding: '1rem', whiteSpace: 'pre-line', color: '#334155', fontSize: '14px' }}>{report.tasksCompleted}</td>
                        <td style={{ padding: '1rem', whiteSpace: 'pre-line', color: '#334155', fontSize: '14px' }}>{report.tasksPlannedNextWeek}</td>
                        <td style={{ padding: '1rem', color: '#0f172a', fontWeight: '600', fontSize: '14px' }}>{report.hoursWorked || 0} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}