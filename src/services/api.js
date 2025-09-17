import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(new Error(error.response.data.error || 'Server error'));
    } else if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      return Promise.reject(new Error('An unexpected error occurred.'));
    }
  }
);

export const analyzeDocument = (formData) => {
  return api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => response.data);
};

export const explainClause = (text) => {
  return api.post('/explain', { text }).then(response => response.data);
};

export const askQuestion = (question, documentText) => {
  return api.post('/ask', { question, documentText }).then(response => response.data);
};

export const healthCheck = () => {
  return api.get('/health').then(response => response.data);
};

export default api;
