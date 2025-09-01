import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-amber-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="LexLink" 
                className="w-10 h-10 transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full opacity-20 blur-sm animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                LexLink
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
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
                className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors duration-200"
              >
                📄 Analyze
              </a>
              <a 
                href="#translate" 
                className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors duration-200"
              >
                🌐 Translate
              </a>
              <a 
                href="#features" 
                className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors duration-200"
              >
                ✨ Features
              </a>
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Status Indicator */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 text-sm font-medium">
            <span>🚀 AI-Powered</span>
            <span>•</span>
            <span>🌍 Multi-Language</span>
            <span>•</span>
            <span>🔊 Text-to-Speech</span>
            <span>•</span>
            <span>💡 Free to Use</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
