const Report = require("../models/Report");

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// Builds a compact text summary of all reports so the AI has context
// about what the team has been working on.
const buildReportsContext = async () => {
  const reports = await Report.find()
    .populate("user", "name")
    .populate("project", "name")
    .sort({ weekStartDate: -1 })
    .limit(100); // keep prompt size reasonable

  if (reports.length === 0) {
    return "No reports have been submitted yet.";
  }

  return reports
    .map((r) => {
      const week = `${new Date(r.weekStartDate).toLocaleDateString()} - ${new Date(
        r.weekEndDate
      ).toLocaleDateString()}`;
      return [
        `Team member: ${r.user?.name || "Unknown"}`,
        `Project: ${r.project?.name || "Unknown"}`,
        `Week: ${week}`,
        `Status: ${r.status}`,
        `Tasks completed: ${r.tasksCompleted}`,
        `Tasks planned next week: ${r.tasksPlannedNextWeek}`,
        `Blockers: ${r.blockers || "None"}`,
        `Hours worked: ${r.hoursWorked || "Not specified"}`,
      ].join("\n");
    })
    .join("\n---\n");
};

// POST /api/ai/chat  (manager only)
const chatWithAssistant = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ message: "Question is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "AI assistant is not configured" });
    }

    const context = await buildReportsContext();

    const prompt = `You are an assistant helping a manager understand their team's weekly reports.
Answer the manager's question using ONLY the report data provided below. Be concise and specific.
If the data doesn't contain the answer, say so honestly.

TEAM REPORT DATA:
${context}

MANAGER'S QUESTION: ${question}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(502).json({ message: "AI service error", details: data });
    }

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response.";

    res.json({ answer });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/ai/summary  (manager only) — generates a team-wide summary
const generateTeamSummary = async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "AI assistant is not configured" });
    }

    const context = await buildReportsContext();

    const prompt = `You are an assistant helping a manager understand their team's weekly reports.
Based on the report data below, write a short summary (max 150 words) covering:
1. Completed work highlights
2. Recurring blockers
3. Any workload imbalances between team members

TEAM REPORT DATA:
${context}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(502).json({ message: "AI service error", details: data });
    }

    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a summary.";

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { chatWithAssistant, generateTeamSummary };
