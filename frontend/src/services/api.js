const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export async function analyzeDocument(formData) {
  const res = await fetch(`${API_BASE}/analyze`, { 
    method: "POST", 
    body: formData 
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Analysis failed: ${res.status}`);
  }
  
  return res.json();
}

export async function explainClause(text) {
  const res = await fetch(`${API_BASE}/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Explanation failed: ${res.status}`);
  }
  
  return res.json();
}

export async function askQuestion(question, documentText) {
  const res = await fetch(`${API_BASE}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, documentText })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Question failed: ${res.status}`);
  }
  
  return res.json();
}

export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json();
}
