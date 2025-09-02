# 🚀 LexLink Deployment Guide - Railway Backend + Vercel Frontend

Complete guide for deploying LexLink with a **completely free** setup:
- **Backend**: Railway (free tier)
- **Frontend**: Vercel (free tier)

## 🏗️ Architecture Overview

```
Frontend (Vercel) ──→ Backend (Railway) ──→ Google Gemini AI
     │                      │
     │                      └── Document Processing
     │                      └── API Endpoints
     │
     └── Static React App
         └── Environment-based API URLs
```

## 📋 Prerequisites

1. **GitHub Repository** with LexLink code
2. **Railway Account** ([railway.app](https://railway.app)) - Free
3. **Vercel Account** ([vercel.com](https://vercel.com)) - Free  
4. **Google Gemini API Key** ([Google AI Studio](https://makersuite.google.com/app/apikey)) - Free

## 🚀 Step-by-Step Deployment

### Step 1: Deploy Backend to Railway

1. **Create Railway Project**:
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your LexLink repository

2. **Configure Backend Deployment**:
   - Railway auto-detects the `/backend` folder
   - No additional configuration needed (uses `railway.toml`)

3. **Set Environment Variables in Railway**:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   ```

4. **Deploy and Get URL**:
   - Railway automatically deploys
   - Copy your Railway URL: `https://your-app.up.railway.app`

### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Project**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Set Environment Variables in Vercel**:
   ```
   VITE_BACKEND_URL=https://your-railway-app.up.railway.app/api
   ```

3. **Deploy**:
   - Vercel automatically builds and deploys
   - Your frontend will be at: `https://your-app.vercel.app`

### Step 3: Update CORS Configuration

Update your Railway backend URL in the CORS settings (already configured in code):

The backend automatically allows requests from `*.vercel.app` domains.

## 🔧 Configuration Details

### Frontend Configuration

The frontend automatically detects the environment:

- **Development**: Uses proxy to `localhost:3001`
- **Production**: Uses `VITE_BACKEND_URL` environment variable

### Backend Configuration

Railway configuration in `/backend/railway.toml`:

```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
startCommand = "npm start"
```

## ✅ Testing Your Deployment

1. **Test Backend Health**:
   ```
   GET https://your-railway-app.up.railway.app/health
   ```

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try uploading a document
   - Verify AI analysis works

3. **Test Integration**:
   - Check browser console for API calls
   - Verify no CORS errors
   - Test all features (translate, audio, etc.)

## 💰 Cost Breakdown

### Completely FREE Tier Limits:

**Railway (Backend)**:
- ✅ 500 hours/month execution time
- ✅ 1GB RAM
- ✅ Shared CPU
- ✅ Custom domains

**Vercel (Frontend)**:
- ✅ 100GB bandwidth/month
- ✅ 100 serverless function executions
- ✅ Custom domains
- ✅ Automatic HTTPS

**Google Gemini AI**:
- ✅ 15 requests/minute free tier
- ✅ 1,500 requests/day

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Verify Vercel URL is allowed in backend CORS settings
   - Check environment variables are set correctly

2. **Backend Not Responding**:
   - Check Railway logs in dashboard
   - Verify health endpoint: `/health`
   - Ensure environment variables are set

3. **Frontend API Calls Failing**:
   - Verify `VITE_BACKEND_URL` is set in Vercel
   - Check browser console for error messages
   - Test backend endpoints directly

4. **Railway Deployment Fails**:
   - Check build logs in Railway dashboard
   - Verify `package.json` has correct start script
   - Ensure Node.js version compatibility

### Debug Commands:

```bash
# Test backend health
curl https://your-railway-app.up.railway.app/health

# Check environment variables (locally)
npm run dev

# Test API endpoint
curl -X POST https://your-railway-app.up.railway.app/api/analyze \
  -F "document=@test.pdf"
```

## 📈 Monitoring and Scaling

### Railway Monitoring:
- View logs in Railway dashboard
- Monitor resource usage
- Set up alerts for downtime

### Vercel Monitoring:
- Analytics in Vercel dashboard
- Function logs and performance
- Core Web Vitals tracking

### Scaling Options:
- Railway Pro: $5/month for more resources
- Vercel Pro: $20/month for team features
- Both platforms scale automatically

## 🔄 Continuous Deployment

Both platforms auto-deploy on Git push:

1. **Push to main branch**
2. **Railway** rebuilds backend automatically
3. **Vercel** rebuilds frontend automatically
4. **Zero downtime** deployments

## 📞 Support Resources

- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Google Gemini AI Docs](https://ai.google.dev/)
- [LexLink GitHub Issues](https://github.com/rajiv-rathod/LexLink/issues)

---

🎉 **Congratulations!** You now have a completely free, production-ready deployment of LexLink!

**Frontend**: Vercel → **Backend**: Railway → **AI**: Google Gemini (All FREE! 🆓)