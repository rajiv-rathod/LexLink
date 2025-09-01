// Use relative URL - this will work if we proxy or if both are on same domain
const API_BASE = "/api";

console.log('API_BASE URL:', API_BASE);

export async function analyzeDocument(file) {
  const formData = new FormData();
  formData.append('document', file);
  
  console.log('Sending request to:', `${API_BASE}/analyze`);
  
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

// ===== NEW GCP-POWERED FEATURES =====

export async function translateText(text, targetLanguage = 'en') {
  const res = await fetch(`${API_BASE}/translate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLanguage })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Translation failed: ${res.status}`);
  }
  
  return res.json();
}

export async function generateAudio(text, languageCode = 'en-US') {
  const res = await fetch(`${API_BASE}/audio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, languageCode })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Audio generation failed: ${res.status}`);
  }
  
  return res.json();
}

export async function checkCompliance(documentText, documentType, jurisdiction = 'US') {
  const res = await fetch(`${API_BASE}/compliance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentText, documentType, jurisdiction })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Compliance check failed: ${res.status}`);
  }
  
  return res.json();
}

export async function benchmarkDocument(documentText, documentType, industry = 'general') {
  const res = await fetch(`${API_BASE}/benchmark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentText, documentType, industry })
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Benchmark analysis failed: ${res.status}`);
  }
  
  return res.json();
}
