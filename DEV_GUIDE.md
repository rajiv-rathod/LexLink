# LexLink Development and Deployment Guide

## 🚀 Quick Start for Development

### Prerequisites
- Node.js (v16 or higher)
- npm

### Local Development Setup

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd LexLink
npm install
cd backend && npm install
cd ../api && npm install
```

2. **Start Development Servers**

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
This starts the Express server on http://localhost:3001

**Terminal 2 - Frontend Server:**
```bash
cd LexLink  # root directory
npm run dev
```
This starts the Vite dev server on http://localhost:5174

3. **Access the Application**
- Open http://localhost:5174 in your browser
- The frontend automatically proxies API calls to the backend on port 3001

## 🌐 Deployment

### Vercel Deployment (Production)

1. **Connect to Vercel**
```bash
npm install -g vercel
vercel login
vercel link
```

2. **Configure Environment Variables** (Optional but recommended)
```bash
vercel env add GEMINI_API_KEY
```
Enter your Google Gemini API key when prompted.

3. **Deploy**
```bash
vercel deploy --prod
```

## 🔧 How It Works

### Development Environment
- **Frontend**: Vite dev server with React
- **Backend**: Express server with file upload handling via multer
- **API Proxy**: Vite proxies `/api` requests to Express backend
- **File Processing**: Real file upload and text extraction

### Production Environment (Vercel)
- **Frontend**: Static site served by Vercel CDN
- **Backend**: Serverless functions in `/api` folder
- **File Processing**: Serverless-compatible file parsing with busboy
- **API Routes**: Direct calls to Vercel serverless functions

## ✨ Features Verified Working

✅ File upload (PDF, TXT, images)  
✅ Document analysis with AI  
✅ Multi-tab analysis interface  
✅ Risk assessment scoring  
✅ Language selection  
✅ Translation capabilities  
✅ Compliance checking  
✅ Text-to-speech functionality  

## 🐛 Troubleshooting

### "Analyze with AI" Errors
- ✅ **Fixed**: File parsing now works properly in both development and production
- ✅ **Fixed**: Error handling improved with clear user feedback
- ✅ **Fixed**: Graceful fallback to mock data when API key not configured

### Development Issues
- Ensure both frontend and backend servers are running
- Check that ports 3001 and 5174 are available
- Verify API proxy configuration in vite.config.js

### Production Issues
- Verify environment variables are set in Vercel dashboard
- Check function logs in Vercel dashboard for errors
- Ensure file size limits are respected (10MB max)