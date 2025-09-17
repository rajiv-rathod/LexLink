# 🚀 LexLink Vercel Deployment Guide

This guide covers deploying LexLink with a **dual Vercel deployment** strategy:
- **Frontend**: Main branch deployed as React application
- **Backend**: Separate branch deployed as Express.js API

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your LexLink code should be in a GitHub repository
3. **Google Gemini API Key**: Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🏗️ Architecture Overview

LexLink uses a **dual Vercel deployment** strategy:

- **Frontend (main branch)**: React + Vite application served statically
- **Backend (backend branch)**: Express.js API deployed separately
- **Cross-Origin**: CORS configured for secure API communication
- **Environment Variables**: Configured separately for each deployment

## 📁 Deployment Structure

```
LexLink Repository/
├── main branch (Frontend)         # 🎨 Vercel Project #1
│   ├── src/                      # React components
│   ├── public/                   # Static assets
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   └── vercel.json              # Frontend Vercel config
│
└── backend branch (Backend)       # 🖥️ Vercel Project #2
    ├── server.js                 # Express server
    ├── routes/                   # API routes
    ├── package.json             # Backend dependencies
    └── vercel.json              # Backend Vercel config
```

## 🚀 Deployment Steps

### Step 1: Deploy Backend (Express API)

1. **Create Backend Branch**:
   ```bash
   # Create and switch to backend branch
   git checkout -b backend
   
   # Move backend files to root
   cp -r backend/* .
   rm -rf backend/ frontend/ src/ public/ api/
   
   # Commit backend-only files
   git add .
   git commit -m "Backend branch for Vercel deployment"
   git push origin backend
   ```

2. **Deploy Backend to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - **Important**: Select the `backend` branch
   - Configure as Node.js project

3. **Configure Backend Environment Variables**:
   | Variable | Value | Required |
   |----------|-------|----------|
   | `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
   | `NODE_ENV` | `production` | ✅ Yes |
   | `ALLOWED_ORIGINS` | Your frontend URL | ✅ Yes |

4. **Get Backend URL**: Copy your backend URL (e.g., `https://lexlink-backend.vercel.app`)

### Step 2: Deploy Frontend (React App)

1. **Switch to Main Branch**:
   ```bash
   # Return to main branch
   git checkout main
   
   # Clean up - keep only frontend files
   rm -rf backend/
   # Frontend files remain in src/, public/, etc.
   ```

2. **Update Frontend Configuration**:
   ```bash
   # Update API endpoint in environment
   echo "VITE_API_URL=https://your-backend.vercel.app" > .env.production
   ```

3. **Deploy Frontend to Vercel**:
   - Create another Vercel project
   - Import the same GitHub repository
   - **Important**: Select the `main` branch
   - Configure as React/Vite project

### Step 3: Configure CORS & Environment

1. **Update Backend CORS** (in backend branch):
   - Add your frontend URL to allowed origins
   - Ensure proper CORS configuration

2. **Test Integration**:
   - Visit your frontend URL
   - Try uploading a document
   - Verify API calls work across domains

## 🔧 Configuration Details

### vercel.json Explained

```json
{
  "version": 2,
  "buildCommand": "npm run build",           // Builds the React frontend
  "outputDirectory": "dist",                 // Vite output directory
  "installCommand": "npm install",           // Install dependencies
  "functions": {
    "api/*.js": {
      "runtime": "@vercel/node@3.1.6",      // Node.js runtime
      "maxDuration": 30                      // 30-second timeout
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",                 // API route matching
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",                     // SPA routing
      "destination": "/index.html"
    }
  ]
}
```

### API Functions Overview

| Endpoint | Purpose | Method |
|----------|---------|--------|
| `/api/health` | Service health check | GET |
| `/api/analyze` | Document analysis | POST |
| `/api/ask` | Ask questions about documents | POST |
| `/api/explain` | Explain specific clauses | POST |
| `/api/translate` | Translate text | POST |
| `/api/audio` | Text-to-speech | POST |
| `/api/compliance` | Compliance checking | POST |
| `/api/benchmark` | Document benchmarking | POST |
| `/api/languages` | Supported languages | GET |

## 🌍 Environment-Specific Features

### With GEMINI_API_KEY Configured:
- ✅ AI-powered document analysis
- ✅ Intelligent Q&A responses
- ✅ Smart translation
- ✅ Advanced compliance checking
- ✅ Document benchmarking

### Without GEMINI_API_KEY (Demo Mode):
- ✅ Mock document analysis
- ✅ Basic Q&A responses
- ✅ Simple translations
- ✅ Web Speech API for TTS
- ✅ Demo compliance reports

## 🔒 Security & Performance

### Security Features:
- CORS properly configured
- Environment variables secure in Vercel
- No sensitive data in client-side code
- Input validation on all endpoints

### Performance Optimizations:
- Text length limits (30,000 chars) for AI processing
- Efficient JSON parsing and validation
- Serverless cold start optimization
- CDN serving for static assets

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**
   ```bash
   # Clear cache and rebuild
   rm -rf node_modules dist
   npm install
   npm run build
   ```

2. **API Functions Don't Work**
   - Check environment variables in Vercel dashboard
   - Verify function timeouts aren't exceeded
   - Check function logs in Vercel dashboard

3. **File Upload Issues**
   - Vercel has 4.5MB body size limit
   - Large files are handled client-side with mock responses
   - For production, consider integrating with cloud storage

4. **AI Features Not Working**
   - Verify `GEMINI_API_KEY` is set correctly
   - Check API quota limits
   - Review function logs for errors

### Logs and Monitoring:

1. **Function Logs**: Available in Vercel dashboard under "Functions"
2. **Real-time Logs**: Use `vercel logs` CLI command
3. **Performance**: Monitor in Vercel Analytics

## 📈 Scaling Considerations

### Vercel Limits:
- **Hobby Plan**: 100GB bandwidth, 100GB function execution
- **Pro Plan**: 1TB bandwidth, unlimited function execution
- **Function Timeout**: Max 30 seconds (configurable)

### Optimization Tips:
1. Implement caching for frequent requests
2. Use Vercel Edge Functions for better performance
3. Consider database integration for user data
4. Implement request rate limiting

## 🔄 Continuous Deployment

### Auto-Deploy Setup:
1. Connect GitHub repository to Vercel
2. Enable auto-deploy on push to main branch
3. Configure preview deployments for pull requests
4. Set up custom domains in Vercel dashboard

### Branch Strategy:
- **main**: Production deployment
- **develop**: Preview deployment
- **feature/***: Pull request previews

## 📞 Support

### Resources:
- [Vercel Documentation](https://vercel.com/docs)
- [Google Gemini AI Docs](https://ai.google.dev/)
- [LexLink GitHub Issues](https://github.com/rajiv-rathod/LexLink/issues)

### Getting Help:
1. Check Vercel function logs first
2. Review environment variables
3. Test API endpoints individually
4. Contact support with specific error messages

---

🎉 **Congratulations!** Your LexLink application is now fully deployed on Vercel with both frontend and backend functionality!