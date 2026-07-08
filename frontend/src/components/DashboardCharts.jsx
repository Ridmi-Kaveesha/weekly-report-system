import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

  // Tasks completed trend over time (team-wide, grouped by week start date)
  const byWeek = {};
  reports.forEach((r) => {
    const weekLabel = new Date(r.weekStartDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    // Count "tasks completed" as number of comma/newline separated items,
    // falling back to 1 if the field just has plain text.
    const taskCount = r.tasksCompleted
      ? r.tasksCompleted.split(/[\n,]/).filter((t) => t.trim() !== "").length
      : 0;
    byWeek[weekLabel] = (byWeek[weekLabel] || 0) + taskCount;
  });
  const trendData = Object.entries(byWeek)
    .map(([week, tasksCompleted]) => ({ week, tasksCompleted }))
    .sort((a, b) => new Date(a.week) - new Date(b.week));

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <div className="card" style={{ flex: 1, minWidth: "400px" }}>
        <h3>Tasks Completed Trend Over Time</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="tasksCompleted"
              stroke="#4f46e5"
              strokeWidth={2}
              name="Tasks Completed"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

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
