# User Profile Demo with Mood Status

A modern full-stack demo of a user profile with an interactive mood status and history tracking.

## Tech Stack

- React - Vite
- Bun - Runtime
- Hono - API
- Drizzle ORM
- PostgreSQL - Database
- Zod - Validation

## Live Demo

- Frontend: https://user-profile-mood-status-demo.vercel.app/
- Backend API: https://user-profile-mood-status-demo-production.up.railway.app/api/profile/current

## Features

- Update user mood and emoji
- Persistent data with PostgreSQL
- Clean UI with emoji-based profile display
- Mood history showing recent entries and timestamps
- Structured backend architecture (routes → services → repository)

# Setup (Local Environment)

## 1. Clone Repository
```
git clone https://github.com/AvZee/User-Profile-Mood-Status-Demo.git
cd User-Profile-Mood-Status-Demo
```

## 2. Install Dependencies

Backend:
```
cd server
bun install
```

Frontend:
```
cd ../client
bun install
```

## 3. Set Environment Variables

Backend (```server/.env```):
```
DATABASE_URL=postgresql://username:password@host:port/database
PORT=3000
```

Frontend (```client/.env```):
```
VITE_API_URL=http://localhost:3000
```

Note: `.env` files are not committed for security reasons.
      Use `.env.example` in both directories as a reference.

## 4. Run the App

Backend:
```
cd server
bun run dev
```

Frontend:
```
cd ../client
bun run dev
```

# Notes

- The frontend communicates with the backend via a REST API
- The backend uses Drizzle ORM for type-safe database queries
- App designed as a full-stack architecture exercise focusing on data flow between layers

