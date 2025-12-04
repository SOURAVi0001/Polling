# Interactive Poll System - Setup Guide

## Prerequisites

- Node.js 14+ installed
- MongoDB running locally or cloud URI configured
- npm or yarn package manager

## Installation & Setup

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```
PORT=5020
MONGO_URI=mongodb://127.0.0.1:27017/intervue-polls
CLIENT_URL=http://localhost:5173
```

For MongoDB Atlas (cloud):

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/intervue-polls
```

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory (optional):

```
VITE_SOCKET_URL=http://localhost:5020
```

## Running the Application

### Terminal 1 - Backend Server

```bash
cd server
npm start
```

Expected output:

```
Server running on port 5020
MongoDB connected successfully
Socket.io ready
```

### Terminal 2 - Frontend Dev Server

```bash
cd client
npm run dev
```

Expected output:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Usage

1. **Open Browser**: Navigate to http://localhost:5173/
2. **Teacher**: Click "Enter as Teacher"
3. **Student**: Enter name and click "Join"
4. **Create Poll**: Teacher fills in question, options (minimum 2), and time limit, then clicks "Launch Poll"
5. **Answer Poll**: Students select an option and click "Submit Answer"
6. **View Results**: Teacher sees live results; students see results after answering
7. **End Poll**: Teacher clicks "End Poll" to close and move to next question

## Features

### Teacher Dashboard

- Create polls with custom questions and options
- Set time limits (30s, 60s, 2m)
- View live results and vote counts
- See list of joined students
- Kick students from the session
- Real-time chat

### Student Interface

- Join with name
- Answer polls in real-time
- Auto-submit on timeout ("No Answer" counted)
- View poll results after answering
- Real-time chat

### Backend Architecture

- **Socket.io Events**: Real-time bidirectional communication
- **MongoDB Persistence**: All polls and responses saved
- **Backend Timer**: Server-driven auto-submit logic
- **REST API**: GET /api/polls (past polls), GET /api/polls/:id (poll details)

### Design System

- **Font**: Inter (Google Fonts)
- **Colors**: Black primary, gray scale, blue accent, amber warnings
- **Spacing**: Consistent padding/margins with Tailwind utilities
- **Animation**: Smooth transitions and loading spinners

## Project Structure

```
intervue-poll-system/
├── server/
│   ├── config.js                 # Environment config
│   ├── server.js                 # Express + Socket.io setup
│   ├── controllers/
│   │   └── pollController.js    # REST handlers
│   ├── routes/
│   │   └── polls.js              # Poll API routes
│   ├── models/
│   │   └── Poll.js               # Mongoose schema
│   ├── sockets/
│   │   └── pollSocket.js        # Socket.io event handlers
│   └── package.json
│
└── client/
    ├── src/
    │   ├── main.jsx             # React entry point
    │   ├── App.jsx              # Main app component
    │   ├── index.css            # Global styles & CSS variables
    │   ├── components/          # Reusable UI components
    │   │   ├── Button.jsx
    │   │   ├── Input.jsx
    │   │   ├── Card.jsx
    │   │   ├── PollOption.jsx
    │   │   ├── StudentListItem.jsx
    │   │   ├── LivePollResults.jsx
    │   │   ├── EmptyPollPlaceholder.jsx
    │   │   ├── AlertBox.jsx
    │   │   ├── Header.jsx
    │   │   └── index.js
    │   ├── features/            # Redux slices
    │   │   ├── pollSlice.js
    │   │   └── studentSlice.js
    │   ├── hooks/
    │   │   └── useSocket.js
    │   └── store/
    │       └── store.js
    ├── tailwind.config.js       # Tailwind design tokens
    ├── vite.config.js
    └── package.json
```

## Troubleshooting

### "Cannot connect to MongoDB"

- Ensure MongoDB is running: `mongod` (local) or check connection string for cloud
- Verify MONGO_URI in `.env`

### "Socket.io connection refused"

- Ensure backend server is running on port 5020
- Check CORS origin is correct (CLIENT_URL in backend .env)

### "Component imports failing"

- Ensure all files in `client/src/components/` exist
- Check `client/src/components/index.js` has all exports

### Hot reload not working

- Restart Vite dev server
- Check file has valid React/JSX syntax

## Environment Variables

### Backend (.env)

- `PORT` - Server port (default: 5020)
- `MONGO_URI` - MongoDB connection string
- `CLIENT_URL` - Frontend origin for CORS (default: http://localhost:5173)

### Frontend (.env)

- `VITE_SOCKET_URL` - Backend Socket.io URL (default: http://localhost:5020)

## Testing

### Test Flow

1. Open two browser windows (teacher + student)
2. Teacher creates poll with 3 options and 60s timeout
3. Two students join and answer
4. Verify live results update on teacher dashboard
5. Confirm timer counts down on student screens
6. Check auto-submit works when timer reaches 0
7. Teacher ends poll and creates next one
8. Repeat

## Production Deployment

### Frontend Build

```bash
cd client
npm run build
```

Outputs optimized build in `client/dist/`

### Deployment Options

- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Backend**: Heroku, Railway, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas, AWS DocumentDB, self-hosted MongoDB

### Environment Setup for Production

Update `.env` with production URLs:

```
PORT=80 (or 443 for HTTPS)
MONGO_URI=mongodb+srv://prod-user:prod-pass@cluster.mongodb.net/intervue-polls
CLIENT_URL=https://yourdomain.com
```

## Support

For issues or questions:

1. Check browser console for errors (F12)
2. Check server logs in terminal
3. Verify all environment variables are set
4. Restart both frontend and backend servers

---

Happy polling! 🎉
