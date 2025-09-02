# 🏛️ LexLink - AI-Powered Legal Document Analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)

> **Demystify Legal Documents** - Upload a document. Get the gist, the gotchas, and what to do next.

LexLink is an intelligent legal document analysis platform that uses advanced AI to break down complex legal documents into plain English, helping users understand their rights, obligations, and potential risks.

## 🌟 Features

### 📄 **Smart Document Processing**
- **Multi-format Support**: PDF, TXT, PNG, JPG documents
- **OCR Technology**: Extract text from images using Tesseract.js
- **Document Type Detection**: Automatically identifies rental agreements, loan contracts, employment contracts, NDAs, and more
- **File Size Limit**: Up to 10MB per document

### 🧠 **AI-Powered Analysis**
- **Google Gemini Integration**: Powered by Gemini 1.5 Flash for accurate legal analysis
- **Risk Assessment**: 1-10 risk scoring with detailed explanations
- **Plain English Summaries**: Complex legal jargon translated to everyday language
- **Key Terms Extraction**: Important clauses highlighted with explanations

### 💬 **Interactive Features**
- **Document Q&A**: Ask specific questions about your uploaded documents
- **Clause Explanations**: Get detailed explanations of specific legal clauses
- **Chat Interface**: Interactive conversation about your legal documents

### 🌍 **Advanced Capabilities**
- **Multi-language Support**: Translation powered by Google Cloud Translate
- **Text-to-Speech**: Audio explanations using Google Cloud TTS
- **Compliance Checking**: Verify documents against legal standards
- **Benchmark Analysis**: Compare documents against industry standards

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key
- (Optional) Google Cloud credentials for advanced features

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rajiv-rathod/LexLink.git
   cd LexLink
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   ```bash
   cd ../backend
   cp .env.example .env
   # Edit .env and add your API keys
   ```

5. **Start the application**

   **Backend** (Terminal 1):
   ```bash
   cd backend
   npm start
   ```

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001

# Optional - For enhanced features
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
```

### API Keys Setup

1. **Google Gemini API**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

2. **Google Cloud (Optional)**:
   - Create a [Google Cloud Project](https://console.cloud.google.com/)
   - Enable Translation and Text-to-Speech APIs
   - Download service account credentials
   - Set the path in your `.env` file

## 📱 Usage

### 1. Document Upload
- Drag and drop your legal document or click to browse
- Supported formats: PDF, TXT, PNG, JPG (max 10MB)
- Wait for AI analysis to complete

### 2. Review Analysis
- **Summary**: Get a concise overview in plain English
- **Key Terms**: Understand important legal concepts
- **Your Rights**: Know what you're entitled to
- **Your Obligations**: Understand what you must do
- **Risk Assessment**: See potential issues and their severity

### 3. Interactive Features
- **Ask Questions**: Get specific answers about your document
- **Explain Clauses**: Click on any section for detailed explanations
- **Get Recommendations**: Receive actionable next steps

## 🏗️ Architecture

### Frontend (`/frontend`)
- **Framework**: React 18.3.1 with Vite
- **Styling**: Tailwind CSS with custom enhanced styles
- **State Management**: React Hooks (useState, useEffect)
- **File Upload**: Drag & drop with validation
- **Components**: Modular design with reusable components

### Backend (`/backend`)
- **Framework**: Node.js with Express.js
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash)
- **File Processing**: Multer for uploads, PDF-parse for PDFs
- **OCR**: Tesseract.js for image text extraction
- **Cloud Services**: Google Cloud Translation & Text-to-Speech

### Key Components

```
frontend/src/
├── components/
│   ├── UploadForm.jsx          # Main upload interface
│   ├── EnhancedResultCard.jsx  # Analysis results display
│   ├── ChatInterface.jsx       # Interactive Q&A
│   └── Navbar.jsx             # Navigation header
├── services/
│   └── api.js                 # API communication layer
└── App.jsx                    # Main application component

backend/
├── routes/
│   └── api.js                 # API endpoints & AI processing
├── server.js                  # Express server setup
└── uploads/                   # Temporary file storage
```

## 🔍 API Endpoints

### Document Analysis
- `POST /api/analyze` - Upload and analyze documents
- `POST /api/explain` - Explain specific clauses
- `POST /api/ask` - Ask questions about documents

### Advanced Features
- `POST /api/translate` - Translate text to different languages
- `POST /api/audio` - Generate speech from text
- `POST /api/compliance` - Check document compliance
- `POST /api/benchmark` - Benchmark against industry standards

### Health & Status
- `GET /health` - Server health check
- `GET /api/health` - API health check

## 🧪 Testing

### Manual Testing
```bash
# Test backend API
curl -X POST -F "document=@sample.pdf" http://localhost:3001/api/analyze

# Test health endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/health
```

### Supported Document Types
- **Rental Agreements**: Lease terms, rent, deposits, tenant rights
- **Loan Contracts**: Interest rates, payment terms, default clauses
- **Employment Contracts**: Salary, benefits, termination clauses
- **NDAs**: Confidentiality terms, disclosure restrictions
- **Terms of Service**: User agreements, privacy policies
- **Purchase Agreements**: Buyer/seller obligations, warranties
- **Insurance Policies**: Coverage, premiums, claims process

## 🚀 Deployment

### Vercel (Recommended - Full Stack)

**Complete deployment with frontend + backend in one project:**

```bash
# 1. Deploy to Vercel
vercel

# 2. Configure environment variables in Vercel dashboard:
#    - GEMINI_API_KEY (required)
#    - NODE_ENV=production

# 3. Your app will be available at: https://your-project.vercel.app
```

📖 **[Complete Vercel Deployment Guide](./DEPLOYMENT.md)**

### Local Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend (already production-ready)
cd backend
npm start
```

### Alternative Cloud Deployment Options
- **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
- **Backend**: Deploy to Railway, Render, or Google Cloud Run
- **Environment**: Ensure all API keys are properly configured

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test new features thoroughly
- Update documentation as needed

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/rajiv-rathod">
        <img src="https://github.com/rajiv-rathod.png" width="100px;" alt="Rajiv Rathod"/>
        <br />
        <sub><b>Rajiv Rathod</b></sub>
      </a>
      <br />
      <sub>Project Creator & Lead Developer</sub>
    </td>
  </tr>
</table>

### Contributions Welcome!
- 🐛 Bug reports and fixes
- 📝 Documentation improvements
- ✨ New feature development
- 🎨 UI/UX enhancements
- 🌍 Internationalization
- 🧪 Test coverage improvements

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI** for the powerful Gemini API
- **Google Cloud** for translation and text-to-speech services
- **Tesseract.js** for OCR capabilities
- **React & Express** communities for excellent frameworks
- **Open Source** contributors and maintainers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/rajiv-rathod/LexLink/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rajiv-rathod/LexLink/discussions)
- **Email**: [Your contact email]

## 🗺️ Roadmap

### Current Version (v1.2.0)
- ✅ Document upload and analysis
- ✅ AI-powered legal analysis
- ✅ Interactive Q&A
- ✅ Multi-format support
- ✅ Risk assessment

### Upcoming Features
- 🔄 Real-time collaboration
- 📊 Analytics dashboard
- 🔐 User authentication
- 💾 Document history
- 📱 Mobile app
- 🏢 Enterprise features

---

<div align="center">

**Built with ❤️ by [Rajiv Rathod](https://github.com/rajiv-rathod)**

[⭐ Star this repo](https://github.com/rajiv-rathod/LexLink) | [🐛 Report Bug](https://github.com/rajiv-rathod/LexLink/issues) | [💡 Request Feature](https://github.com/rajiv-rathod/LexLink/issues)

</div> - Generative AI for Demystifying Legal Documents

This PR transforms LexLink from a basic document analyzer into a comprehensive, hackathon-ready AI platform that demystifies legal documents for everyday users. The enhancements directly address the hackathon challenge of making legal documents accessible and empowering users to make informed decisions.

## 🎯 Problem Solved
Legal documents like rental agreements, loan contracts, and terms of service are filled with complex jargon that creates information asymmetry, putting users at financial and legal risk. This solution bridges that gap with AI-powered analysis and clear, actionable guidance.

## 🚀 Key Features Implemented

### Advanced AI Analysis Engine
- **Smart Document Detection**: Automatically categorizes documents (rental, loan, employment, ToS, etc.) for specialized analysis
- **Sophisticated AI Prompts**: Enhanced prompts that generate structured, comprehensive legal analysis
- **Risk-First Approach**: Immediate identification of potential legal and financial risks

### Professional Risk Assessment
- **Visual Risk Scoring**: 1-10 risk assessment with color-coded indicators
- **Categorized Threats**: High/Medium/Low severity classification for each risk factor
- **Red Flags Detection**: Automatically highlights concerning clauses that need attention
- **Risk Explanation**: Clear explanations of why each risk matters to the user

### Actionable Recommendations System
- **Priority-Based Actions**: High/Medium/Low priority recommendations with clear reasoning
- **Step-by-Step Guidance**: Immediate next steps users should take
- **Legal Help Guidelines**: Specific situations when professional consultation is recommended
- **Document-Specific Advice**: Tailored recommendations based on document type

### Interactive Chat Interface
- **Q&A System**: Users can ask follow-up questions about their documents
- **Suggested Questions**: Pre-populated common questions for each document type
- **Enhanced Responses**: Detailed answers with relevant clauses and follow-up suggestions
- **Conversation Flow**: Persistent chat history for comprehensive exploration

### Professional User Experience
- **Tabbed Interface**: Clean navigation between Overview, Risk Analysis, Recommendations, and Details
- **Modern File Upload**: Drag & drop interface with visual feedback and file validation
- **Loading States**: Professional animations and progress indicators
- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Error Handling**: Graceful fallbacks with user-friendly error messages

## 🔧 Technical Enhancements

### Backend Improvements
- Enhanced API routes with better error handling
- Mock response system for demonstration without API keys
- Structured JSON responses for consistent data handling
- Document type detection algorithm

### Frontend Architecture
- Modern React components with hooks
- Clean component separation and reusability
- Professional styling with Tailwind CSS
- Type-safe API integration

## 📊 Analysis Capabilities

The enhanced system provides:
- **Rights & Obligations**: Clear breakdown of what users can expect vs. what they must do
- **Key Terms Explained**: Legal jargon translated into everyday language
- **Document Summaries**: Concise, accessible overviews of complex agreements
- **Risk Factors**: Detailed analysis of potential financial and legal dangers
- **Red Flags**: Immediate alerts for concerning or unusual clauses

## 🎯 Hackathon Readiness

This solution is now competition-ready with:
- ✅ **Professional UI** that builds user trust and confidence
- ✅ **Demo Functionality** that works without external API dependencies
- ✅ **Clear Value Proposition** solving real user pain points
- ✅ **Interactive Features** for engaging presentations
- ✅ **Comprehensive Analysis** that goes beyond simple summaries

## 📸 Visual Transformation

**Before**: Basic file upload with simple text output
![Before Enhancement](https://github.com/user-attachments/assets/b9aed9ce-78b8-459d-97d5-717de046ebec)

**After**: Professional interface with comprehensive analysis
![Enhanced Upload Interface](https://github.com/user-attachments/assets/cd2b4775-87e5-44c1-a95d-71f08c29115c)

**Complete Analysis View**: Tabbed interface with risk assessment and interactive chat
![Complete Analysis](https://github.com/user-attachments/assets/7d1180d0-de2b-461f-92e4-f346d569783e)

## 🏆 Competitive Advantage

This enhanced LexLink platform stands out by:
- **Going beyond summaries** to provide actionable risk assessment
- **Offering interactive Q&A** for deeper document exploration
- **Providing specific recommendations** rather than generic advice
- **Presenting information visually** with professional UI/UX
- **Supporting multiple document types** with specialized analysis

The platform now empowers users to understand their legal obligations, identify risks, and take concrete steps to protect themselves—directly addressing the hackathon's goal of demystifying legal documents and enabling informed decision-making.
