import React from 'react';
import { SYSTEM_LOGS } from '../../constants';
import { useTheme } from '../../context/ThemeContext';

export const Marquee: React.FC = () => {
  const { isDarkMode } = useTheme();
  const glassClass = isDarkMode 
    ? 'bg-white/5 backdrop-blur-md border-b border-white/20 text-white' 
    : 'bg-[#ffcc00] border-b-2 border-black text-black';

  return (
    <div className={`overflow-hidden whitespace-nowrap py-1 font-mono text-xs font-bold uppercase select-none z-10 relative ${glassClass}`}>
      <div className="inline-block animate-marquee">
        {SYSTEM_LOGS.map((log, i) => (
          <span key={i} className="mx-6">✦ {log}</span>
        ))}
        {SYSTEM_LOGS.map((log, i) => (
          <span key={`dup-${i}`} className="mx-6">✦ {log}</span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
