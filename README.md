# LibroBaratito - Buscalibre Price Tracker

A web platform that monitors book prices on Buscalibre.com, notifies users when prices drop below a desired threshold, and displays full price history.

## Problem

Book prices on Buscalibre fluctuate constantly. Today a book costs $25.000 CLP, tomorrow it could be $18.000. Without a monitoring system, users miss these opportunities.

## Solution

LibroBaratito automatically tracks prices every 12 hours and alerts users via email when prices drop below their configured threshold.

## Tech Stack

| Layer | Technology | Hosting |
|-------|------------|---------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS | Vercel |
| Backend | Hono + Node.js (TypeScript) | Render |
| Database | Supabase (PostgreSQL) | Supabase Cloud |
| Authentication | Supabase Auth | Supabase Cloud |
| Email | Resend | Resend Cloud |
| AI Development | OpenCode + Gemini 2.5 Flash | - |

## Repository Structure

```
buscalibre-tracker/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages and layouts
│   │   │   ├── dashboard/   # User dashboard
│   │   │   ├── books/       # Book management pages
│   │   │   ├── notifications/
│   │   │   └── profile/
│   │   └── lib/             # Utilities and Supabase client
│   ├── .env.example         # Environment variables template
│   └── package.json
│
├── backend/                  # Hono API server
│   ├── src/
│   │   ├── presentation/    # Route handlers
│   │   │   └── routes/      # API endpoints (books, alerts, notifications)
│   │   ├── config/          # Configuration (CORS, etc.)
│   │   ├── lib/             # Supabase client
│   │   ├── index.ts         # Server entry point
│   │   └── server.ts        # Server setup
│   ├── .env.example         # Environment variables template
│   └── package.json
│
├── ai-specs/                # Project documentation and AI standards
│   ├── specs/              # Development standards and specifications
│   │   ├── backend-standards.mdc
│   │   ├── frontend-standards.mdc
│   │   ├── documentation-standards.mdc
│   │   ├── api-spec.yml
│   │   └── data-model.md
│   └── changes/            # Implementation plans
│
├── AGENTS.md               # AI Agent configurations
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- Render account (for backend deployment)
- Vercel account (for frontend deployment)
- Resend account (for email sending)

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/ivanexDev/buscalibre-tracker.git
cd buscalibre-tracker
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the database migrations in the Supabase SQL Editor (see `ai-specs/specs/data-model.md`)
3. Get your API credentials from Project Settings → API

### 3. Backend Setup

```bash
cd backend
npm install

# Copy the environment variables template
cp .env.example .env

# Edit .env with your Supabase credentials (see Environment Variables section)
npm run dev
```

The backend will run at `http://localhost:3001`

### 4. Frontend Setup

```bash
cd frontend
npm install

# Copy the environment variables template
cp .env.example .env

# Edit .env with your Supabase credentials (see Environment Variables section)
npm run dev
```

The frontend will run at `http://localhost:3000`

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (anon public) |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL (default: http://localhost:3001) |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (for admin operations) |
| `RESEND_API_KEY` | API key from Resend (for sending emails) |
| `FRONTEND_URL` | Frontend URL (default: http://localhost:3000) |
| `PORT` | Server port (default: 3001) |
| `NODE_ENV` | Environment (development/production) |

## AI-Driven Development with OpenCode

This project uses **OpenCode** as the primary AI coding agent, following a Spec-Driven Development methodology.

### Workflow

1. **Plan**: Use `/plan-frontend` or `/plan-backend` commands to generate an implementation plan
2. **Develop**: Use `/develop-frontend` or `/develop-backend` to implement specific tickets
3. **Document**: Keep specs updated in `ai-specs/` folder

### Available Commands

OpenCode commands are defined in `.opencode/commands/`:

- `/plan-frontend <ticket_id>` - Plan frontend implementation
- `/plan-backend <ticket_id>` - Plan backend implementation  
- `/develop-frontend <ticket_id> <design_prompt>` - Implement frontend with design requirements
- `/develop-backend <ticket_id>` - Implement backend endpoint
- `/explain` - Explain code or architecture decisions
- `/commit` - Create a git commit with proper conventions

### MCPs Configured

- **GitHub MCP**: Automated PRs, branches, and reviews
- **Jira MCP**: Ticket management and sprint planning
- **Supabase MCP**: Database operations and migrations

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/books` | Add a new book to track |
| GET | `/api/books` | List user's tracked books |
| DELETE | `/api/books/:id` | Remove a book from tracking |
| GET | `/api/books/:id/history` | Get price history for a book |
| PUT | `/api/books/:id/alert` | Update alert threshold |
| GET | `/api/notifications` | Get user's notification history |

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Render)

1. Connect your GitHub repository to Render
2. Create a Web Service with:
   - Build command: `npm install`
   - Start command: `npm start`
3. Configure environment variables in Render dashboard

### Keep-Alive

Use UptimeRobot or similar to ping your backend periodically to prevent Render's free tier from sleeping.

## Useful Links

- **Jira**: [Project Board](https://mauriciofb.atlassian.net/jira/software/projects/BOARD/boards/1)
- **Notion**: [Project Documentation](https://notion.so/)
- **Supabase**: [Dashboard](https://supabase.com/dashboard)
- **Vercel**: [Dashboard](https://vercel.com/dashboard)
- **Render**: [Dashboard](https://dashboard.render.com/)
- **Resend**: [Dashboard](https://resend.com/)

## License

MIT License - See LICENSE file for details.
