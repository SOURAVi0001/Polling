# Deployment Guide - Render

This guide explains how to deploy the Polling application to Render.

## Prerequisites

1. Render account: https://render.com
2. MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
3. GitHub repository with this code

## Step 1: Set Up MongoDB Atlas

1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create a cluster (Free tier is available)
3. Create a database user
4. Get the connection string:
   - Click "Connect"
   - Select "Drivers"
   - Copy the connection string
   - It will look like: `mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName`

## Step 2: Deploy Backend to Render

### Option A: Using render.yaml (Recommended)

1. Push code to GitHub
2. Go to https://dashboard.render.com
3. Click "New +"
4. Select "Web Service"
5. Connect your GitHub repository
6. Select the repository
7. Render will auto-detect `render.yaml`
8. Click "Create Web Service"
9. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `CLIENT_URL`: Will be set automatically after frontend deployment

### Option B: Manual Setup

1. Go to https://dashboard.render.com
2. Click "New +"
3. Select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `poll-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `server`
   - **Environment**: Node 18+

6. Add Environment Variables:
   ```
   PORT=10000
   MONGO_URI=<your-mongodb-connection-string>
   CLIENT_URL=<your-frontend-url-after-deployment>
   ```

7. Click "Create Web Service"
8. Copy the backend URL (will be like `https://poll-backend.onrender.com`)

## Step 3: Deploy Frontend to Render

1. Go to https://dashboard.render.com
2. Click "New +"
3. Select "Static Site"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `poll-frontend`
   - **Build Command**: `cd client2 && npm install && npm run build`
   - **Publish Directory**: `client2/dist`

6. Add Environment Variables:
   ```
   VITE_API_URL=https://poll-backend.onrender.com
   VITE_SOCKET_URL=https://poll-backend.onrender.com
   ```

7. Click "Create Static Site"
8. Copy the frontend URL (will be like `https://poll-frontend.onrender.com`)

## Step 4: Update Backend Environment Variables

1. Go back to backend service in Render
2. Go to "Environment"
3. Update `CLIENT_URL` to your frontend URL:
   ```
   CLIENT_URL=https://poll-frontend.onrender.com
   ```

## Step 5: Test the Deployment

1. Open your frontend URL in browser: `https://poll-frontend.onrender.com`
2. Select Role (Teacher or Student)
3. Enter your ID/Name
4. Verify polling works

## Environment Variables Reference

### Backend (.env in root or Render Dashboard)
```
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=AppName
CLIENT_URL=https://polling-frontend.onrender.com
```

### Frontend (client2/.env or Render Dashboard)
```
VITE_API_URL=https://polling-backend.onrender.com
VITE_SOCKET_URL=https://polling-backend.onrender.com
```

## Troubleshooting

### Backend fails to start
- Check MongoDB connection string is correct
- Verify `MONGO_URI` has correct username and password
- Check MongoDB Atlas has IP whitelist set to `0.0.0.0/0`

### Frontend can't connect to backend
- Verify `VITE_API_URL` and `VITE_SOCKET_URL` are correct
- Check backend `CLIENT_URL` matches frontend domain
- Verify CORS is properly configured in server

### Real-time updates not working
- Ensure Socket.io is connecting to correct URL
- Check browser console for connection errors
- Verify both VITE_API_URL and VITE_SOCKET_URL are identical

## Local Development

To test locally before deployment:

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (in another terminal)
cd client2
npm install
npm run dev
```

Access at: `http://localhost:5174`

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string copied
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Render
- [ ] Environment variables set correctly
- [ ] Backend and frontend URLs updated in each other's config
- [ ] CORS enabled for frontend domain
- [ ] MongoDB IP whitelist set to 0.0.0.0/0
- [ ] Application tested end-to-end
