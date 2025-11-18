import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ConfirmState {
  show: boolean;
  message: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
}

export const useConfirmModal = () => {
  const [confirmInfo, setConfirmInfo] = useState<ConfirmState>({ 
    show: false, message: '', onConfirm: null, onCancel: null 
  });

  const showConfirm = (message: string, onConfirm: () => void, onCancel: () => void = () => {}) => 
    setConfirmInfo({ show: true, message, onConfirm, onCancel });

  const handleConfirm = () => { 
    confirmInfo.onConfirm && confirmInfo.onConfirm(); 
    setConfirmInfo({ show: false, message: '', onConfirm: null, onCancel: null }); 
  };
  
  const handleCancel = () => { 
    confirmInfo.onCancel && confirmInfo.onCancel(); 
    setConfirmInfo({ show: false, message: '', onConfirm: null, onCancel: null }); 
  };

  const ConfirmComponent = () => {
    const { isDarkMode } = useTheme();
    if (!confirmInfo.show) return null;

    const containerStyle = isDarkMode 
      ? 'bg-black/40 backdrop-blur-xl border border-white/20 text-white shadow-[0_0_40px_rgba(59,130,246,0.3)]' 
      : 'bg-white text-black border-4 border-black shadow-[12px_12px_0px_0px_#88ccff]';

    const noBtnStyle = isDarkMode
        ? 'bg-white/10 hover:bg-white/20 border border-white/10'
        : 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none bg-gray-200 text-black';

    const yesBtnStyle = isDarkMode
        ? 'bg-blue-600/80 hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]'
        : 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none bg-[#88ccff] text-black';

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
        <div className={`${containerStyle} p-6 max-w-sm w-full mx-4`}>
          <div className={`flex justify-between items-center mb-4 pb-2 ${isDarkMode ? 'border-b border-white/20' : 'border-b-4 border-black'}`}>
            <h3 className="text-xl font-black uppercase tracking-tighter">Confirm</h3>
            <button onClick={handleCancel}><X size={24} strokeWidth={3} /></button>
          </div>
          <p className="text-lg font-bold mb-8 font-mono leading-snug">{confirmInfo.message}</p>
          <div className="flex gap-4">
            <button onClick={handleCancel} className={`flex-1 px-4 py-3 text-sm font-black uppercase transition-all ${noBtnStyle}`}>No</button>
            <button onClick={handleConfirm} className={`flex-1 px-4 py-3 text-sm font-black uppercase transition-all ${yesBtnStyle}`}>Yes</button>
          </div>
        </div>
      </div>
    );
  };
  return { showConfirm, ConfirmComponent };
};
