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
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-500 relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full blur-xl animate-pulse opacity-30"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full blur-xl animate-pulse opacity-20 animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-gray-100 dark:bg-gray-800 rounded-full blur-xl animate-pulse opacity-25 animation-delay-4000"></div>
        </div>

        {/* Logo Animation */}
        {showLoading && <LogoAnimation onComplete={handleLoadingComplete} />}
        
        {/* Main App */}
        {!showLoading && (
          <div className="relative z-10">
            <Header />
            <main className="max-w-6xl mx-auto px-4 py-12">
              {/* Hero Section */}
              <div className="text-center mb-16 relative">
                <div className="relative inline-block group">
                  <h1 className="text-6xl md:text-8xl font-extrabold mb-6 animate-fade-in-up text-gray-900 dark:text-white">
                    LexLink
                  </h1>
                </div>
                
                <div className="relative">
                  <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
                    🚀 Upload a document. Get the gist, the gotchas, and what to do next. 
                    <br />
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">
                      AI-powered legal document analysis in 20+ languages.
                    </span>
                  </p>

                  {/* Feature Highlights */}
                  <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up animation-delay-600">
                    {[
                      { icon: '🤖', text: 'AI Analysis' },
                      { icon: '🌍', text: '20+ Languages' },
                      { icon: '�', text: 'Risk Assessment' },
                      { icon: '🌙', text: 'Dark Mode' },
                      { icon: '💯', text: 'Free Forever' }
                    ].map((feature, index) => (
                      <div 
                        key={index}
                        className="group flex items-center space-x-3 px-6 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 font-medium hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer hover:shadow-lg"
                        style={{ animationDelay: `${(index + 1) * 200}ms` }}
                      >
                        <span className="text-2xl group-hover:animate-bounce">{feature.icon}</span>
                        <span className="font-semibold">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Form */}
              <div className="animate-fade-in-up animation-delay-900">
                <UploadForm />
              </div>

              {/* Additional Features Section */}
              <div className="mt-20 text-center animate-fade-in-up animation-delay-1200">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 relative">
                  Why Choose LexLink?
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
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
                      className="group p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:bg-gray-100 dark:hover:bg-gray-700 relative overflow-hidden animate-fade-in-up"
                      style={{ animationDelay: `${1500 + index * 200}ms` }}
                    >
                      <div className="relative z-10">
                        <div className="text-6xl mb-6 group-hover:animate-bounce transition-transform duration-300">{feature.icon}</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </main>
            <Footer />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
