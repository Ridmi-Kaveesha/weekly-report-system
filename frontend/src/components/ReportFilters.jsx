export default function ReportFilters({ filters, onChange, projects, members }) {
  const inputStyle = {
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  };

  return (
    <div className="card" style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
      <select
        style={inputStyle}
        value={filters.user}
        onChange={(e) => onChange({ ...filters, user: e.target.value })}
      >
        <option value="">All Team Members</option>
        {members.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name}
          </option>
        ))}
      </select>

      <select
        style={inputStyle}
        value={filters.project}
        onChange={(e) => onChange({ ...filters, project: e.target.value })}
      >
        <option value="">All Projects</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <label style={{ fontSize: "14px" }}>
        From:{" "}
        <input
          type="date"
          style={inputStyle}
          value={filters.startDate}
          onChange={(e) => onChange({ ...filters, startDate: e.target.value })}
        />
      </label>

      <label style={{ fontSize: "14px" }}>
        To:{" "}
        <input
          type="date"
          style={inputStyle}
          value={filters.endDate}
          onChange={(e) => onChange({ ...filters, endDate: e.target.value })}
        />
      </label>

      <button
        className="btn btn-secondary"
        style={{ width: "auto", padding: "8px 16px" }}
        onClick={() => onChange({ user: "", project: "", startDate: "", endDate: "" })}
      >
        Clear Filters
      </button>
    </div>
  );
}
