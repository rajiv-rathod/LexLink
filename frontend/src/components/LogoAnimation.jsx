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
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center z-50 transition-all duration-500">
      <div className="relative">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="LexLink"
          className={`transition-all duration-1000 ease-in-out ${
            stage === 'big' 
              ? 'w-48 h-48 opacity-100' 
              : stage === 'loading'
              ? 'w-16 h-16 opacity-80'
              : 'w-8 h-8 opacity-60'
          }`}
        />
        
        {/* Loading Animation */}
        {stage === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Company Name */}
        <div className={`text-center mt-4 transition-all duration-1000 ${
          stage === 'big' 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-4'
        }`}>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
            LexLink
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
            Legal Intelligence Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoAnimation;
