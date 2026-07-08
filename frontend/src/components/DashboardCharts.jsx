import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#f59e0b", "#ef4444", "#10b981", "#6366f1"];

export default function DashboardCharts({ reports }) {
  // Submission status by team member
  const byMember = {};
  reports.forEach((r) => {
    const name = r.user?.name || "Unknown";
    if (!byMember[name]) byMember[name] = { name, submitted: 0, draft: 0 };
    if (r.status === "submitted") byMember[name].submitted += 1;
    else byMember[name].draft += 1;
  });
  const memberData = Object.values(byMember);

  // Workload by project
  const byProject = {};
  reports.forEach((r) => {
    const name = r.project?.name || "Unknown";
    byProject[name] = (byProject[name] || 0) + 1;
  });
  const projectData = Object.entries(byProject).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <div className="card" style={{ flex: 1, minWidth: "400px" }}>
        <h3>Submission Status by Team Member</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={memberData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="submitted" fill="#4f46e5" name="Submitted" />
            <Bar dataKey="draft" fill="#f59e0b" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ flex: 1, minWidth: "400px" }}>
        <h3>Workload Distribution by Project</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={projectData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {projectData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
