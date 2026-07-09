import api from "./axios";

export const chatWithAssistant = (question) => api.post("/ai/chat", { question });
export const generateTeamSummary = () => api.post("/ai/summary");
