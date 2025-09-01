import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import LogoAnimation from './components/LogoAnimation';
import Header from './components/Header';
import UploadForm from './components/UploadForm';
import Footer from './components/Footer';
import "./enhanced-styles.css";

export default function App() {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Logo Animation */}
        {showLoading && <LogoAnimation onComplete={handleLoadingComplete} />}
        
        {/* Main App */}
        {!showLoading && (
          <>
            <Header />
            <main className="max-w-6xl mx-auto px-4 py-12">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="relative inline-block">
                  <h1 className="text-6xl md:text-7xl font-extrabold mb-4">
                    <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                      LexLink
                    </span>
                  </h1>
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-lg opacity-10 blur-xl"></div>
                </div>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  🚀 Upload a document. Get the gist, the gotchas, and what to do next. 
                  <br />
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    AI-powered analysis in 20+ languages with text-to-speech support.
                  </span>
                </p>

                {/* Feature Highlights */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {[
                    { icon: '🤖', text: 'AI Analysis' },
                    { icon: '🌍', text: '20+ Languages' },
                    { icon: '🔊', text: 'Text-to-Speech' },
                    { icon: '🌙', text: 'Dark Mode' },
                    { icon: '💯', text: 'Free Forever' }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-full text-sm font-medium text-amber-800 dark:text-amber-200"
                    >
                      <span>{feature.icon}</span>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload Form */}
              <UploadForm />

              {/* Additional Features Section */}
              <div className="mt-16 text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  Why Choose LexLink?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: '🎯',
                      title: 'Accurate Analysis',
                      description: 'AI-powered legal document analysis with high accuracy and detailed insights.'
                    },
                    {
                      icon: '🌐',
                      title: 'Multi-Language',
                      description: 'Support for 20+ languages including Hindi, Tamil, Telugu, Bengali, and more.'
                    },
                    {
                      icon: '🔒',
                      title: 'Secure & Private',
                      description: 'Your documents are processed securely and never stored permanently.'
                    }
                  ].map((feature, index) => (
                    <div 
                      key={index}
                      className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </main>
            <Footer />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}
