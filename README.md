# LibroBaratito - Buscalibre Price Tracker

LibroBaratito is a web platform that monitors book prices on Buscalibre.com, notifies users when prices drop below a desired threshold, and displays full price history.

## 🚀 Overview

The prices on Buscalibre fluctuate constantly. LibroBaratito helps you catch the best deals without manual checking.

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Hono + Node.js (TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Resend

## 📁 Repository Structure

```
buscalibre-tracker/
├── frontend/          # Next.js (Vercel)
├── backend/           # Hono + Node.js (Render)
├── ai-specs/          # Project documentation and AI standards
│   ├── specs/         # Development standards and specifications
│   │   ├── base-standards.mdc
│   │   ├── backend-standards.mdc
│   │   ├── frontend-standards.mdc
│   │   ├── documentation-standards.mdc
│   │   ├── api-spec.yml
│   │   ├── data-model.md
│   │   └── development_guide.md
│   └── changes/       # Implementation plans
├── AGENTS.md          # AI Agent configurations
└── README.md
```

## 🛠️ Getting Started

Follow the instructions in [ai-specs/specs/development_guide.md](ai-specs/specs/development_guide.md) to set up your local development environment.

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🤖 AI-Driven Development

This project uses **AI Specifications** to ensure consistent code quality and standards across different AI coding copilots (Claude, Cursor, Copilot, Gemini).

All development follows the principles defined in `ai-specs/specs/base-standards.mdc`:
1. **Small Tasks, One at a Time**
2. **Test-Driven Development (TDD)**
3. **Type Safety (TypeScript)**
4. **English Only** (Code, Docs, Commits)
5. **Incremental Changes**

## 📖 Documentation

- [API Specification](ai-specs/specs/api-spec.yml)
- [Data Model](ai-specs/specs/data-model.md)
- [Backend Standards](ai-specs/specs/backend-standards.mdc)
- [Frontend Standards](ai-specs/specs/frontend-standards.mdc)
- [Documentation Standards](ai-specs/specs/documentation-standards.mdc)

## 🤝 License

Copyright (c) 2026 LibroBaratito Team.
Licensed under the MIT License.
