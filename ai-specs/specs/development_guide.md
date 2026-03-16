# Development Guide

This guide provides step-by-step instructions for setting up the development environment and running tests for the Buscalibre Price Tracker (LibroBaratito) system.

## 🚀 Setup Instructions

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**

### 1. Clone the Repository

```bash
git clone git@github.com:ivanexDev/buscalibre-tracker.git
cd buscalibre-tracker
```

### 2. Environment Configuration

Create environment files for both backend and frontend. Copy the example environment files:

**Backend Environment** (`backend/.env`):
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Application Configuration
PORT=3000
NODE_ENV=development

# Resend (Email Service)
RESEND_API_KEY=your_resend_api_key
```

**Frontend Environment** (`frontend/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend API will be available at `http://localhost:3000`

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:3001`

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing

```bash
cd frontend

# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
buscalibre-tracker/
├── frontend/          # Next.js 14 (App Router) + TypeScript
│   ├── app/           # App router pages
│   ├── lib/           # Supabase client
│   └── package.json
├── backend/           # Hono + Node.js (TypeScript)
│   ├── src/
│   │   ├── config/    # Configuration files
│   │   ├── lib/       # Supabase client
│   │   ├── presentation/
│   │   │   └── routes/# API routes
│   │   ├── services/  # Business logic
│   │   ├── index.ts  # Main entry
│   │   └── server.ts  # Server setup
│   └── package.json
└── ai-specs/          # AI specs and documentation
```

## 🔧 Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Hono, Node.js, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email**: Resend
- **Hosting**: Vercel (frontend), Render (backend)
