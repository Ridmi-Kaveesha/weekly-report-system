const statusClass = {
  submitted: "badge-submitted",
  draft: "badge-draft",
  late: "badge-late",
};

export default function ReportHistory({ reports, onEdit }) {
  if (!reports.length) {
    return (
      <div className="card">
        <p>No reports yet. Create your first weekly report above.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Report History</h3>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>Project</th>
            <th>Status</th>
            <th>Hours</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id}>
              <td>
                {new Date(r.weekStartDate).toLocaleDateString()} -{" "}
                {new Date(r.weekEndDate).toLocaleDateString()}
              </td>
              <td>{r.project?.name || "—"}</td>
              <td>
                <span className={`badge ${statusClass[r.status] || ""}`}>{r.status}</span>
              </td>
              <td>{r.hoursWorked || "—"}</td>
              <td>
                <button className="btn btn-secondary" onClick={() => onEdit(r)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
