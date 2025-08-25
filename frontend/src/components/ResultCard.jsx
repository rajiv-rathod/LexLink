export default function ResultCard({ analysis, gemini }) {
  const { document, contentAnalysis } = analysis || {};
  return (
    <div className="card p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">📑 Analysis</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Document</h3>
          <ul className="text-sm space-y-1">
            <li><b>Name:</b> {document?.filename}</li>
            <li><b>Type:</b> {document?.type}</li>
            <li><b>Size:</b> {Math.round((document?.size || 0)/1024)} KB</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Content Stats</h3>
          <ul className="text-sm space-y-1">
            <li><b>Detected Type:</b> {contentAnalysis?.docType}</li>
            <li><b>Words:</b> {contentAnalysis?.wordCount}</li>
            <li><b>Lines:</b> {contentAnalysis?.lineCount}</li>
            <li><b>Dates:</b> {contentAnalysis?.containsDates ? "Yes" : "No"}</li>
            <li><b>Numbers:</b> {contentAnalysis?.containsNumbers ? "Yes" : "No"}</li>
          </ul>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Preview</h3>
        <pre className="text-xs bg-white/10 rounded-xl p-3 whitespace-pre-wrap">
          {contentAnalysis?.preview}
        </pre>
      </div>

      {gemini && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-2">🧠 AI Summary</h2>
          <p className="text-sm opacity-90 mb-3">{gemini.summary}</p>

          {gemini.keyPoints?.length > 0 && (
            <>
              <h3 className="font-semibold">Key Points</h3>
              <ul className="list-disc ml-6 text-sm space-y-1">
                {gemini.keyPoints.map((k, i) => <li key={i}>{k}</li>)}
              </ul>
            </>
          )}

          <div className="mt-4 text-sm">
            <b>Risk Level:</b> {gemini.riskLevel || "Unknown"}
          </div>

          {gemini.actions?.length > 0 && (
            <>
              <h3 className="font-semibold mt-3">Suggested Actions</h3>
              <ul className="list-disc ml-6 text-sm space-y-1">
                {gemini.actions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
