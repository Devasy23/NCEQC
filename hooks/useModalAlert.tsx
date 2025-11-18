import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const useModalAlert = () => {
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '' });
  const showAlert = (message: string) => setAlertInfo({ show: true, message });
  const closeAlert = () => setAlertInfo({ show: false, message: '' });

  const AlertComponent = () => {
    const { isDarkMode } = useTheme();
    if (!alertInfo.show) return null;
    
    const containerStyle = isDarkMode 
      ? 'bg-black/40 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_40px_rgba(139,92,246,0.3)]' 
      : 'bg-white text-black border-4 border-black shadow-[12px_12px_0px_0px_#ff4444]';
    
    const btnStyle = isDarkMode 
      ? 'bg-purple-600/80 hover:bg-purple-600 text-white rounded-md shadow-[0_0_15px_rgba(147,51,234,0.5)]' 
      : 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none bg-[#ff4444] text-white';

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
        <div className={`${containerStyle} p-6 max-w-sm w-full mx-4 relative transition-all`}>
          <div className={`flex justify-between items-center mb-4 pb-2 ${isDarkMode ? 'border-b border-white/20' : 'border-b-4 border-black'}`}>
            <h3 className="text-xl font-black uppercase tracking-tighter">System Alert</h3>
            <button onClick={closeAlert}><X size={24} strokeWidth={3} /></button>
          </div>
          <p className="text-lg font-bold mb-8 font-mono leading-snug">{alertInfo.message}</p>
          <button onClick={closeAlert} className={`w-full px-4 py-3 text-sm font-black uppercase transition-all ${btnStyle}`}>
            Acknowledge
          </button>
        </div>
      </div>
    );
  };
  return { showAlert, AlertComponent };
};
