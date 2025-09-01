import { useState } from "react";
import { analyzeDocument } from "../services/api";
import EnhancedResultCard from "./EnhancedResultCard";
import LanguageSelector from "./LanguageSelector";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const onAnalyze = async (e) => {
    e.preventDefault();
    if (!file) { 
      setErr("Please choose a file first."); 
      return; 
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      setErr('Unsupported file type. Please use PDF, TXT, PNG, or JPG files.');
      return;
    }
    
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErr('File size too large. Please use files smaller than 10MB.');
      return;
    }
    
    setErr(""); 
    setAnalysis(null);
    setLoading(true);

    try {
      const result = await analyzeDocument(file);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setErr(error.message || "Failed to analyze document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.type === 'text/plain') {
        setFile(droppedFile);
        setErr("");
      } else {
        setErr("Please upload a PDF or TXT file only.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Form */}
      <div className="card p-8">
        <form onSubmit={onAnalyze} className="space-y-6">
          {/* Drag & Drop Upload Area */}
          <div>
            <label className="block text-lg font-semibold mb-3">Upload Your Legal Document</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-indigo-400 bg-indigo-500/10' 
                  : 'border-white/20 hover:border-white/40'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="text-4xl mb-2">📄</div>
                <div>
                  <p className="text-lg mb-2">
                    Drop your document here or click to browse
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports PDF and TXT files (max 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.txt,.png,.jpg,.jpeg"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile(selectedFile);
                      setErr("");
                    }
                  }}
                />
              </div>
            </div>
            
            {file && (
              <div className="mt-3 p-3 bg-white/5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-green-400">📎</span>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <div className="flex flex-col items-center gap-4">
            <button 
              type="submit"
              className={`btn btn-primary text-lg px-8 py-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading || !file}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing Document...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>🧠</span>
                  <span>Analyze with AI</span>
                </div>
              )}
            </button>
            
            {err && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-2 rounded-lg text-sm">
                {err}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {analysis && (
        <EnhancedResultCard analysis={analysis} />
      )}
    </div>
  );
}
