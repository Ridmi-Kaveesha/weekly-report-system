# Weekly Report Generator & Team Dashboard

Full-stack web app for team members to submit weekly reports and for managers to
view/analyze them across the team.

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js / Express
- Database: MongoDB (MongoDB Atlas)
- AI Assistant: Google Gemini API

## Project Structure
```
weekly-report-app/
├── backend/     # Express API server
└── frontend/    # React app
```

## Setup Instructions

### 1. Installing Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Running the Database

This project uses MongoDB Atlas (cloud-hosted MongoDB), so there is no local
database to install.

1. Create a free cluster at https://www.mongodb.com/cloud/atlas/register
2. Create a database user and allow network access (0.0.0.0/0 for testing)
3. Copy your connection string from Atlas → "Connect" → "Drivers"

In the `backend` folder, create a `.env` file with the following:

```
MONGO_URI=mongodb+srv://<username>:<password>@yourcluster.mongodb.net/weekly-report-app
JWT_SECRET=any_random_secret_string
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key
```

**Getting a free Gemini API key (no credit card required):**
1. Go to https://aistudio.google.com
2. Sign in with a Google account
3. Click "Get API key" → "Create API key"
4. Copy the key into `GEMINI_API_KEY` above

> Note: the AI Chat Assistant feature will not work without a valid
> `GEMINI_API_KEY`, but the rest of the application (auth, reports, dashboard)
> works independently of it.

### 3. Running the Backend
```bash
cd backend
npm run dev
```
Server runs at `http://localhost:5000`

### 4. Running the Frontend
```bash
cd frontend
npm run dev
```
App runs at `http://localhost:3000`

## Features
- Role-based authentication (Team Member / Manager)
- Weekly report creation, editing, and submission (with late-status detection)
- Manager dashboard with filters (member, project, date range)
- Project/category management
- Data visualizations (charts) for submission status, workload, and task trends
- **AI Chat Assistant** (manager-only) — ask natural-language questions about
  team activity or generate an AI summary of completed work, blockers, and
  workload balance

## AI Chat Assistant

Accessible via the floating chat button on the Manager Dashboard.

**Approach:** The backend gathers all submitted weekly reports (team member,
project, tasks, blockers, hours) into a compact text context, then sends it
to the Google Gemini API (`gemini-2.5-flash`) along with the manager's
question or a summary request. The model is instructed to answer only from
the provided report data.

**Endpoints:**
| Endpoint | Role | Description |
|---|---|---|
| POST /api/ai/chat | Manager | Ask a question about team activity |
| POST /api/ai/summary | Manager | Generate a team-wide summary |

**Data privacy:** Report data is sent to Google's Gemini API only when a
manager actively uses the assistant (no background/automatic calls). No
report data is stored by the AI provider beyond the request lifecycle
(per Gemini API terms). The API key is kept server-side in `.env` and never
exposed to the frontend.

## API Overview
| Endpoint | Role | Description |
|---|---|---|
| POST /api/auth/register | Public | Register a new user |
| POST /api/auth/login | Public | Login |
| GET /api/auth/team-members | Manager | List team members (for filters) |
| GET /api/projects | Any logged-in user | List projects |
| POST /api/projects | Manager | Create project |
| PUT /api/projects/:id | Manager | Edit project |
| DELETE /api/projects/:id | Manager | Delete project |
| POST /api/reports | Team Member | Create report |
| PUT /api/reports/:id | Team Member (own) | Edit report |
| GET /api/reports/my | Team Member | View own report history |
| GET /api/reports | Manager | View all reports (supports filters) |
| POST /api/ai/chat | Manager | Ask the AI assistant a question |
| POST /api/ai/summary | Manager | Generate an AI team summary |
