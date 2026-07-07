# Weekly Report Generator & Team Dashboard

Full-stack web app for team members to submit weekly reports and for managers to
view/analyze them across the team.

## Tech Stack
- Frontend: React
- Backend: Node.js / Express
- Database: MongoDB (MongoDB Atlas)

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

In the `backend` folder, create a `.env` file (copy `.env.example`) and paste
your connection string:

```
MONGO_URI=mongodb+srv://<username>:<password>@yourcluster.mongodb.net/weekly-report-app
JWT_SECRET=any_random_secret_string
PORT=5000
```

### 3. Running the Backend
```bash
cd backend
npm run dev
```
Server runs at `http://localhost:5000`

### 4. Running the Frontend
```bash
cd frontend
npm start
```
App runs at `http://localhost:3000`

## Features
- Role-based authentication (Team Member / Manager)
- Weekly report creation, editing, and submission
- Manager dashboard with filters (member, project, date range)
- Project/category management
- Data visualizations (charts) for submission status and workload

## API Overview
| Endpoint | Role | Description |
|---|---|---|
| POST /api/auth/register | Public | Register a new user |
| POST /api/auth/login | Public | Login |
| GET /api/projects | Any logged-in user | List projects |
| POST /api/projects | Manager | Create project |
| PUT /api/projects/:id | Manager | Edit project |
| DELETE /api/projects/:id | Manager | Delete project |
| POST /api/reports | Team Member | Create report |
| PUT /api/reports/:id | Team Member (own) | Edit report |
| GET /api/reports/my | Team Member | View own report history |
| GET /api/reports | Manager | View all reports (supports filters) |
