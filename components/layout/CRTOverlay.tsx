import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export const CRTOverlay: React.FC = () => {
  const { isCrtMode } = useTheme();

  if (!isCrtMode) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden h-full w-full">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
      <div className="absolute inset-0 bg-white opacity-[0.02] animate-flicker pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      <style>{`
        @keyframes flicker {
          0% { opacity: 0.02; }
          5% { opacity: 0.05; }
          10% { opacity: 0.02; }
          100% { opacity: 0.02; }
        }
        .animate-flicker { animation: flicker 0.15s infinite; }
      `}</style>
    </div>
  );
};
