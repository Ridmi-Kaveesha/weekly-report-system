import { useState } from "react";
import { chatWithAssistant, generateTeamSummary } from "../api/ai";

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await chatWithAssistant(userMessage.text);
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSummary = async () => {
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: "Generate a team summary" }]);
    try {
      const res = await generateTeamSummary();
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.summary }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "#1d4ed8",
          color: "white",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          zIndex: 1000,
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "24px",
            width: "360px",
            maxHeight: "500px",
            background: "white",
            borderRadius: "12px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1e3a8a",
              color: "white",
              padding: "14px 16px",
              borderRadius: "12px 12px 0 0",
              fontWeight: 600,
            }}
          >
            AI Team Assistant
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 16px",
              minHeight: "200px",
              maxHeight: "320px",
            }}
          >
            {messages.length === 0 && (
              <p style={{ fontSize: "13px", color: "#6b7280" }}>
                Ask me about your team's activity, e.g. "What did the team work on this
                week?" or "Are there any recurring blockers?"
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "10px",
                  textAlign: m.role === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    maxWidth: "85%",
                    background: m.role === "user" ? "#1d4ed8" : "#f3f4f6",
                    color: m.role === "user" ? "white" : "#1f2937",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.text}
                </span>
              </div>
            ))}
            {loading && <p style={{ fontSize: "13px", color: "#6b7280" }}>Thinking...</p>}
          </div>

          <div style={{ padding: "10px", borderTop: "1px solid #e5e7eb" }}>
            <button
              onClick={handleSummary}
              disabled={loading}
              style={{
                width: "100%",
                marginBottom: "8px",
                padding: "8px",
                fontSize: "13px",
                background: "#eef2ff",
                color: "#1d4ed8",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Generate Team Summary
            </button>
            <form onSubmit={handleAsk} style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "8px 14px",
                  background: "#1d4ed8",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
