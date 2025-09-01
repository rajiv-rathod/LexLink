import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-amber-400 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-yellow-400 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <img 
                  src="/logo.png" 
                  alt="LexLink" 
                  className="w-12 h-12 transition-all duration-300 hover:scale-110 hover:rotate-12"
                  style={{
                    filter: 'brightness(1.5) contrast(1.5) saturate(1.3)'
                  }}
                  onError={(e) => {
                    console.log('Footer logo failed to load:', e);
                    // Fallback to a text logo if image fails
                    e.target.outerHTML = '<div class="w-12 h-12 bg-amber-400 rounded-lg flex items-center justify-center text-gray-900 font-bold text-lg border-2 border-amber-600">LL</div>';
                  }}
                />
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                  LexLink
                </h3>
                <p className="text-xs text-gray-400">Legal Intelligence Platform</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering legal professionals and individuals with AI-powered document analysis, 
              multi-language support, and accessibility features.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-200 hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-200 hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-200 hover:scale-110">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-400 flex items-center space-x-2">
              <span>✨</span>
              <span>Features</span>
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-3 hover:text-amber-300 transition-colors cursor-pointer">
                <span>📄</span>
                <span>Document Analysis</span>
              </li>
              <li className="flex items-center space-x-3 hover:text-amber-300 transition-colors cursor-pointer">
                <span>🌐</span>
                <span>Multi-Language Support</span>
              </li>
              <li className="flex items-center space-x-3 hover:text-amber-300 transition-colors cursor-pointer">
                <span>🔊</span>
                <span>Text-to-Speech</span>
              </li>
              <li className="flex items-center space-x-3 hover:text-amber-300 transition-colors cursor-pointer">
                <span>🌙</span>
                <span>Dark/Light Mode</span>
              </li>
              <li className="flex items-center space-x-3 hover:text-amber-300 transition-colors cursor-pointer">
                <span>🤖</span>
                <span>AI-Powered Analysis</span>
              </li>
            </ul>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-400 flex items-center space-x-2">
              <span>🌍</span>
              <span>Languages</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-amber-300 transition-colors cursor-pointer">🇮🇳 Hindi, Tamil, Telugu, Bengali</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">🇮🇳 Marathi, Gujarati, Kannada</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">🇺🇸 English, 🇪🇸 Spanish</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">🇫🇷 French, 🇩🇪 German</li>
              <li className="hover:text-amber-300 transition-colors cursor-pointer">🇨🇳 Chinese, 🇯🇵 Japanese</li>
            </ul>
          </div>

          {/* Contributors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-400 flex items-center space-x-2">
              <span>👥</span>
              <span>Contributors</span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="group">
                <a href="https://github.com/shretadas" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center space-x-2 text-amber-300 hover:text-amber-200 transition-all duration-200 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-xs group-hover:animate-pulse">
                    SD
                  </div>
                  <div>
                    <div className="font-bold">Shreta Das</div>
                    <div className="text-xs text-gray-400">Team Leader</div>
                  </div>
                </a>
              </li>
              <li className="group">
                <a href="https://github.com/rajiv-rathod" target="_blank" rel="noopener noreferrer" 
                   className="flex items-center space-x-2 text-amber-300 hover:text-amber-200 transition-all duration-200 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xs group-hover:animate-pulse">
                    RR
                  </div>
                  <div>
                    <div className="font-bold">Rajiv Rathod</div>
                    <div className="text-xs text-gray-400">Team Member</div>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-amber-400 flex items-center space-x-2">
              <span>⚖️</span>
              <span>Legal</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 hover:underline">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 hover:underline">Disclaimer</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors duration-200 hover:underline">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400 flex items-center space-x-2">
              <span>© {currentYear} LexLink. All rights reserved.</span>
              <span className="animate-pulse">❤️</span>
              <span>Built for legal professionals.</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center space-x-2 hover:text-amber-400 transition-colors cursor-pointer">
                <span className="animate-bounce">🚀</span>
                <span>Powered by AI</span>
              </span>
              <span className="flex items-center space-x-2 hover:text-amber-400 transition-colors cursor-pointer">
                <span>🔒</span>
                <span>Secure & Private</span>
              </span>
              <span className="flex items-center space-x-2 hover:text-amber-400 transition-colors cursor-pointer">
                <span className="animate-pulse">💯</span>
                <span>Free Forever</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;