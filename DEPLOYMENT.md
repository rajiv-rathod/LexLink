# 🚀 Complete Vercel Deployment Guide for LexLink

This guide covers deploying the entire LexLink application (frontend + backend API) to Vercel as a full-stack serverless application.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your LexLink code should be in a GitHub repository
3. **Google Gemini API Key**: Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🏗️ Architecture Overview

LexLink is deployed as a **single Vercel project** with:

- **Frontend**: React + Vite application served statically
- **Backend**: Serverless API functions in the `/api` directory
- **Routing**: All API calls go to `/api/*` endpoints
- **File Processing**: Client-side file handling with server-side AI analysis

## 📁 Project Structure for Vercel

```
LexLink/
├── api/                    # 🔥 Vercel Serverless Functions
│   ├── analyze.js         # Document analysis endpoint
│   ├── ask.js             # Q&A functionality
│   ├── audio.js           # Text-to-speech
│   ├── benchmark.js       # Document benchmarking
│   ├── compliance.js      # Compliance checking
│   ├── explain.js         # Clause explanation
│   ├── health.js          # Health check
│   ├── languages.js       # Supported languages
│   ├── translate.js       # Translation service
│   └── tts.js             # Text-to-speech (alias)
├── frontend/              # React frontend source
├── src/                   # React components (root level)
├── public/                # Static assets
├── dist/                  # Built frontend (auto-generated)
├── vercel.json           # Vercel configuration
├── package.json          # Root package.json for frontend
└── .env.example          # Environment variables template
```

## 🚀 Deployment Steps

### Step 1: Prepare Repository

1. Ensure your repository structure matches the above
2. Copy `.env.example` to `.env` and configure your API keys locally
3. Test the build process:
   ```bash
   npm install
   npm run build
   ```

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click "Deploy"

#### Option B: Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy from project root:
   ```bash
   vercel
   ```

3. Follow the prompts to link to your project

### Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable | Value | Required |
|----------|-------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
| `NODE_ENV` | `production` | ⚠️ Recommended |
| `GOOGLE_APPLICATION_CREDENTIALS` | Google Cloud service account (optional) | ❌ No |

3. Click "Save" and redeploy

### Step 4: Test Deployment

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Test the health endpoint: `https://your-project.vercel.app/api/health`
3. Upload a document to test the analysis functionality
4. Try the translation and text-to-speech features

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