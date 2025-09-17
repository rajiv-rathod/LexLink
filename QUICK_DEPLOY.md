# 🚀 Quick Deployment Guide for LexLink

## Overview
LexLink uses a **dual Vercel deployment** strategy:
- **Frontend**: `main` branch → React app
- **Backend**: `backend` branch → Express API

## Step-by-Step Deployment

### 1. Prepare Backend Branch

```bash
# Create and switch to backend branch
git checkout -b backend

# Move backend files to root level
cp backend/* .
cp backend/.env.example .

# Remove unnecessary directories
rm -rf frontend/ src/ public/ backend/ api/

# Update package.json (keep only backend dependencies)
# Update any file paths in backend code if needed

# Commit the backend-only files
git add .
git commit -m "Backend branch for Vercel deployment"
git push origin backend
```

### 2. Deploy Backend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. **Important**: Select `backend` branch
5. Deploy with default settings

**Set Environment Variables:**
- `GEMINI_API_KEY` = your Google Gemini API key
- `NODE_ENV` = production
- `ALLOWED_ORIGINS` = https://your-frontend-url.vercel.app

### 3. Deploy Frontend to Vercel

```bash
# Switch back to main branch
git checkout main

# Clean up if needed (backend files should not be in main)
```

1. Create another Vercel project
2. Import the same GitHub repository
3. **Important**: Select `main` branch
4. Deploy with default settings

**Set Environment Variables:**
- `VITE_API_URL` = https://your-backend-url.vercel.app/api

### 4. Test Everything

1. **Backend Health**: `GET https://your-backend.vercel.app/health`
2. **Frontend**: Visit `https://your-frontend.vercel.app`
3. **Integration**: Upload a document and verify it works

## Environment Variables Summary

### Backend Project (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend Project (.env)
```env
VITE_API_URL=https://your-backend.vercel.app/api
```

## Troubleshooting

### CORS Issues
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check browser console for specific CORS errors

### Backend Not Responding
- Check function logs in Vercel dashboard
- Verify environment variables are set
- Test health endpoint directly

### Frontend API Calls Failing
- Verify `VITE_API_URL` is correct
- Check Network tab in browser dev tools
- Ensure backend is deployed and accessible

## Repository Structure After Cleanup

```
main branch (Frontend):
├── src/           # React components
├── public/        # Static assets  
├── package.json   # Frontend dependencies
├── vite.config.js # Vite configuration
└── vercel.json    # Frontend Vercel config

backend branch (Backend):
├── server.js      # Express server
├── routes/        # API routes
├── package.json   # Backend dependencies
└── vercel.json    # Backend Vercel config
```

🎉 **You now have a completely free, production-ready dual Vercel deployment!**