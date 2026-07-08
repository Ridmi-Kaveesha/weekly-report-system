export default function RecentActivity({ reports }) {
  const recent = [...reports]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="card">
      <h3>Recent Activity</h3>
      {recent.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        <ul style={{ listStyle: "none" }}>
          {recent.map((r) => (
            <li key={r._id} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: "14px" }}>
              <strong>{r.user?.name}</strong> {r.status === "submitted" ? "submitted" : "saved a draft of"} a
              report for <strong>{r.project?.name}</strong> (week of{" "}
              {new Date(r.weekStartDate).toLocaleDateString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
