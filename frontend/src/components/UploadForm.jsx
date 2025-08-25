import { useState } from "react";
import { analyzeDocument, explainWithGemini } from "../services/api";
import ResultCard from "./ResultCard";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [gemini, setGemini] = useState(null);
  const [ai, setAi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onAnalyze = async (e) => {
    e.preventDefault();
    setErr(""); setGemini(null); setAnalysis(null);
    if (!file) { setErr("Choose a file first."); return; }

    try {
      setLoading(true);
      const a = await analyzeDocument(file);
      setAnalysis(a);

      if (ai && a?.rawText) {
        const context = `Detected type: ${a.contentAnalysis?.docType}`;
        const g = await explainWithGemini(a.rawText, context);
        setGemini(g);
      }
    } catch (e) {
      setErr(e.message || "Failed to analyze");
    } finally {
      setLoading(false);
      // allow re-selecting same file next time
      setFile(null);
      e.target.reset?.();
    }
  };

  return (
    <div className="card p-8">
      <form onSubmit={onAnalyze} className="space-y-4">
        <div>
          <label className="block text-sm mb-2">Upload a PDF or TXT</label>
          <input
            type="file"
            accept=".pdf,.txt"
            className="input"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="flex items-center gap-3 text-sm">
          <input id="ai" type="checkbox" checked={ai} onChange={e=>setAi(e.target.checked)} />
          <label htmlFor="ai">Generate AI Summary (Gemini)</label>
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Analyzing…" : "Analyze Document"}
        </button>

        {err && <div className="text-red-200 text-sm">{err}</div>}
      </form>

      {analysis && (
        <ResultCard analysis={analysis} gemini={gemini} />
      )}
    </div>
  );
}
