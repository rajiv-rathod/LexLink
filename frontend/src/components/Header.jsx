import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <img 
                src="/logo.png" 
                alt="LexLink" 
                className="w-12 h-12 transition-all duration-300 hover:scale-110"
                style={{ filter: 'brightness(1.3) contrast(1.5) saturate(1.2)' }}
                onError={(e) => {
                  console.log('Header logo failed to load:', e);
                  // Fallback to a text logo if image fails
                  e.target.outerHTML = '<div class="w-12 h-12 bg-gray-800 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-gray-800 font-bold text-lg border-2 border-gray-600 dark:border-gray-300">LL</div>';
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white hover:scale-105 transition-transform duration-300 cursor-pointer">
                LexLink
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium tracking-wide">
                Legal Intelligence Platform
              </p>
            </div>
          </div>

          {/* Navigation and Controls */}
          <div className="flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <a 
                href="#analyze" 
                className="group flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="group-hover:animate-bounce">📄</span>
                <span>Analyze</span>
              </a>
              <a 
                href="#translate" 
                className="group flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="group-hover:animate-spin">🌐</span>
                <span>Translate</span>
              </a>
              <a 
                href="#features" 
                className="group flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <span className="group-hover:animate-pulse">✨</span>
                <span>Features</span>
              </a>
            </nav>

            {/* Theme Toggle - Properly Centered */}
            <div className="flex items-center justify-center">
              <ThemeToggle />
            </div>

            {/* Status Indicator */}
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-xs font-medium border border-green-200 dark:border-green-700 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6 text-sm font-medium">
            <span className="flex items-center space-x-1 hover:scale-105 transition-transform duration-200">
              <span className="animate-bounce">🚀</span>
              <span>AI-Powered</span>
            </span>
            <span className="hidden sm:block text-gray-400">•</span>
            <span className="flex items-center space-x-1 hover:scale-105 transition-transform duration-200">
              <span className="animate-spin" style={{ animationDuration: '3s' }}>🌍</span>
              <span>Multi-Language</span>
            </span>
            <span className="hidden sm:block text-gray-400">•</span>
            <span className="flex items-center space-x-1 hover:scale-105 transition-transform duration-200">
              <span className="animate-pulse">🔊</span>
              <span>Text-to-Speech</span>
            </span>
            <span className="hidden sm:block text-gray-400">•</span>
            <span className="flex items-center space-x-1 hover:scale-105 transition-transform duration-200">
              <span className="animate-bounce" style={{ animationDelay: '0.5s' }}>💡</span>
              <span>Free to Use</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
