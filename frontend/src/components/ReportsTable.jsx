const statusClass = {
  submitted: "badge-submitted",
  draft: "badge-draft",
  late: "badge-late",
};

export default function ReportsTable({ reports }) {
  return (
    <div className="card">
      <h3>Team Reports</h3>
      {reports.length === 0 ? (
        <p>No reports match the selected filters.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Team Member</th>
              <th>Week</th>
              <th>Project</th>
              <th>Status</th>
              <th>Hours</th>
              <th>Blockers</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id}>
                <td>{r.user?.name}</td>
                <td>
                  {new Date(r.weekStartDate).toLocaleDateString()} -{" "}
                  {new Date(r.weekEndDate).toLocaleDateString()}
                </td>
                <td>{r.project?.name}</td>
                <td>
                  <span className={`badge ${statusClass[r.status] || ""}`}>{r.status}</span>
                </td>
                <td>{r.hoursWorked || "—"}</td>
                <td>{r.blockers ? r.blockers.slice(0, 40) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
