# Polling Application - Render Deployment Guide

## Quick Start - Local Development

### Backend
```bash
cd server
npm install
npm run dev
```
Server runs on: `http://localhost:5020`

### Frontend
```bash
cd client2
npm install
npm run dev
```
Client runs on: `http://localhost:5174`

## Deployment to Render

### Prerequisites
1. **MongoDB Atlas Account** - https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string

2. **GitHub Repository** - Push your code to GitHub

3. **Render Account** - https://render.com

### Step-by-Step Deployment

#### 1. Create MongoDB Connection String
- Go to MongoDB Atlas
- Create a cluster
- Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName`

#### 2. Deploy Backend

**Option A: Automatic (Using render.yaml)**
- Push code to GitHub
- Go to Render Dashboard
- Click "New +" → "Web Service"
- Connect repository
- Render auto-detects render.yaml
- Add `MONGO_URI` environment variable
- Deploy!

**Option B: Manual**
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Select your GitHub repository
4. Configure:
   - Name: `poll-backend`
   - Runtime: Node
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Environment Variables:
   ```
   PORT=10000
   MONGO_URI=<your-mongodb-uri>
   CLIENT_URL=<will-update-later>
   ```
6. Click "Create Web Service"
7. Note the backend URL

#### 3. Deploy Frontend
1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Select same GitHub repository
4. Configure:
   - Name: `poll-frontend`
   - Build Command: `cd client2 && npm install && npm run build`
   - Publish Directory: `client2/dist`
5. Environment Variables:
   ```
   VITE_API_URL=https://poll-backend.onrender.com
   VITE_SOCKET_URL=https://poll-backend.onrender.com
   ```
6. Click "Create Static Site"
7. Note the frontend URL

#### 4. Update Backend CORS
1. Go to backend service in Render
2. Edit environment variable:
   ```
   CLIENT_URL=https://poll-frontend.onrender.com
   ```

## Environment Variables

### Backend (server/.env)
```
PORT=5020                    # Local development
MONGO_URI=<mongodb-string>   # Get from MongoDB Atlas
CLIENT_URL=http://localhost:5174  # Update for production
```

### Frontend (client2/.env)
```
VITE_API_URL=http://localhost:5020
VITE_SOCKET_URL=http://localhost:5020
```

## Project Structure

```
pander/
├── server/                 # Express backend
│   ├── .env               # Server environment variables
│   ├── .env.example       # Template
│   ├── package.json
│   ├── server.js
│   ├── config.js
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── controllers/        # Route handlers
│   └── sockets/           # Socket.io handlers
│
├── client2/               # React frontend
│   ├── .env               # Frontend environment variables
│   ├── .env.example       # Template
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── features/
│   │   └── store/
│   └── dist/              # Build output
│
├── render.yaml            # Render deployment config
└── DEPLOYMENT.md          # Detailed deployment guide
```

## Features

- **Teacher Role**: Create polls, view history, manage students
- **Student Role**: Answer polls in real-time
- **Chat System**: In-app messaging
- **Database**: Polls stored in MongoDB with teacher identification
- **Real-time**: Socket.io for live updates

## Testing

1. Open frontend URL in browser
2. Select role (Teacher/Student)
3. Enter unique ID
4. For Teachers: Create a poll
5. For Students: Wait for poll and answer

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify database user credentials
- Check PORT not in use

### Frontend can't connect
- Check VITE_API_URL and VITE_SOCKET_URL
- Verify backend is running
- Check browser console for errors

### Polls not saving
- Verify MongoDB is connected
- Check teacherName is being sent
- Review server logs

## More Information

See `DEPLOYMENT.md` for detailed deployment instructions.
