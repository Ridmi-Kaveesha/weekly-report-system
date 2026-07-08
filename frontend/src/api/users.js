import api from "./axios";

export const getTeamMembers = () => api.get("/auth/team-members");
