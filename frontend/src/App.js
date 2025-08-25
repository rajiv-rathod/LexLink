import React from "react";
import Navbar from "./components/Navbar";
import UploadForm from "./components/UploadForm";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-700 text-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold mb-4 text-center">LexLink</h1>
        <p className="text-lg text-center text-gray-200 mb-12">
          Demystify your legal documents with AI-powered analysis.
        </p>
        <UploadForm />
      </main>
      <footer className="text-center text-gray-300 py-6 text-sm">
        © 2025 LexLink. All Rights Reserved.
      </footer>
    </div>
  );
}
