# LexLink Backend - Railway Deployment

This is the Express.js backend for LexLink, designed to be deployed on Railway for completely free hosting.

## 🚀 Railway Deployment

### Prerequisites
1. [Railway Account](https://railway.app) (free)
2. GitHub repository connected to Railway
3. Google Gemini API key

### Quick Deploy to Railway

1. **Connect to Railway**:
   - Go to [railway.app](https://railway.app)
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your LexLink repository

2. **Configure Railway Deployment**:
   - Railway will auto-detect the backend in `/backend` folder
   - The `railway.toml` and `nixpacks.toml` files are pre-configured

3. **Set Environment Variables**:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=production
   PORT=3001
   ```

4. **Deploy**:
   - Railway will automatically build and deploy
   - Your backend will be available at: `https://your-app-name.up.railway.app`

### Local Development

```bash
cd backend
npm install
npm run dev
```

Server runs on http://localhost:3001

### API Endpoints

- `GET /health` - Health check
- `POST /api/analyze` - Document analysis
- `POST /api/ask` - Q&A functionality  
- `POST /api/translate` - Translation service
- `POST /api/audio` - Text-to-speech
- `POST /api/compliance` - Compliance checking
- `POST /api/benchmark` - Document benchmarking
- `POST /api/explain` - Clause explanation

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google Gemini AI API key |
| `NODE_ENV` | ⚠️ Recommended | Set to `production` for Railway |
| `PORT` | ❌ No | Port number (Railway sets automatically) |

### CORS Configuration

The backend is configured to accept requests from:
- Vercel domains (`*.vercel.app`)
- Local development (`localhost`)
- Custom domains (configurable)

### Monitoring

- Health endpoint: `https://your-app.up.railway.app/health`
- Railway dashboard provides logs and metrics
- Automatic restarts on failures

## 🔧 Configuration Files

- `railway.toml` - Railway deployment configuration
- `nixpacks.toml` - Build configuration  
- `server.js` - Main Express server
- `routes/api.js` - API route handlers