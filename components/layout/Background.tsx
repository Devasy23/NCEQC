import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Background: React.FC = () => {
  const { isDarkMode } = useTheme();

  if (!isDarkMode) {
    return (
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0" 
           style={{ 
             backgroundImage: `linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-pink-600/20 rounded-full blur-[100px] animate-bounce" style={{animationDuration: '10s'}}></div>
    </div>
  );
};
