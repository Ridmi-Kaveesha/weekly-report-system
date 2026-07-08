export default function SummaryCards({ reports }) {
  const totalSubmitted = reports.filter((r) => r.status === "submitted").length;
  const totalPending = reports.filter((r) => r.status === "draft").length;
  const complianceRate =
    reports.length > 0 ? Math.round((totalSubmitted / reports.length) * 100) : 0;
  const openBlockers = reports.filter((r) => r.blockers && r.blockers.trim() !== "").length;

  const cardStyle = {
    flex: 1,
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
      <div style={cardStyle}>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>Total Reports</p>
        <h2>{reports.length}</h2>
      </div>
      <div style={cardStyle}>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>Submission Compliance</p>
        <h2>{complianceRate}%</h2>
      </div>
      <div style={cardStyle}>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>Pending</p>
        <h2>{totalPending}</h2>
      </div>
      <div style={cardStyle}>
        <p style={{ fontSize: "13px", color: "#6b7280" }}>Open Blockers</p>
        <h2>{openBlockers}</h2>
      </div>
    </div>
  );
}
