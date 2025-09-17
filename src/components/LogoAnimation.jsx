import React, { useState, useEffect } from 'react';

const LogoAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState('big'); // big -> loading -> small

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage('loading');
    }, 1500);

    const timer2 = setTimeout(() => {
      setStage('small');
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50 transition-all duration-500">
      <div className="relative z-10">
        {/* Logo with Spinning Animation */}
        <div className="relative flex items-center justify-center">
                    <img 
            src="/logo.png" 
            alt="LexLink" 
            className="w-24 h-24 animate-spin"
            onError={(e) => {
              console.log('Logo failed to load:', e);
              // Fallback to a styled text logo
              e.target.outerHTML = '<div class="w-24 h-24 bg-gray-800 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-gray-800 font-bold text-2xl animate-spin border-4 border-gray-600 dark:border-gray-300">LL</div>';
            }}
          />
        </div>
        
        {/* Company Name */}
        <div className={`text-center mt-6 transition-all duration-1000 ${
          stage === 'big' 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-4'
        }`}>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            LexLink
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium tracking-wide">
            Legal Intelligence Platform
          </p>
          <div className="mt-3 flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
            <span className="text-gray-500 dark:text-gray-400 text-sm">Powered by AI</span>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>
        </div>

        {/* Loading Progress Bar */}
        {stage === 'loading' && (
          <div className="mt-8 w-64 mx-auto">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" 
                   style={{ width: '100%', animation: 'loadingBar 2s ease-in-out' }}></div>
            </div>
            <p className="text-center text-gray-600 dark:text-gray-400 mt-3 text-sm animate-pulse">
              Initializing Legal Intelligence...
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes loadingBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default LogoAnimation;
