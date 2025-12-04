# Intervue Poll System

This repo contains a real-time interactive poll system (frontend + backend).

- Frontend: React + Vite (client/)
- Backend: Node.js + Express + Socket.io + Mongoose (server/)

Quick start (backend):

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `CLIENT_URL`.
2. In `server/` run:

```bash
npm install
npm run dev
```

Quick start (frontend):

1. In `client/` run:

```bash
npm install
npm run dev
```

The backend exposes REST endpoints under `/api/polls` and Socket.io events for real-time interaction.

# Intervue Poll System

This project was generated automatically. It contains a Node.js/Express/Socket.io backend and a React/Vite frontend.

## Prerequisites

1. Node.js installed.
2. MongoDB running locally on port 27017.

## Setup & Run

### 1. Start the Backend

Open a terminal:

```bash
cd server
npm install
npm run dev
```

The server will start on port 5000 and connect to MongoDB.

### 2. Start the Frontend

Open a NEW terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will start on http://localhost:5173.

## Features

- **Teacher:** Create polls, view live results, kick students.
- **Student:** Join with name, vote, view results, 60s timer.
- **Real-time:** Powered by Socket.io.
