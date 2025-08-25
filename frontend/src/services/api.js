const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export async function analyzeDocument(file) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}/analyze`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(`Analyze failed: ${res.status}`);
  return res.json();
}

export async function explainWithGemini(text, context = "") {
  const res = await fetch(`${API_BASE}/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, context })
  });
  if (!res.ok) throw new Error(`Explain failed: ${res.status}`);
  return res.json();
}
