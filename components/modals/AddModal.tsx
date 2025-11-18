import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getInputStyle, getPrimaryButtonStyle } from '../../utils/styles';

interface AddModalProps {
    type: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const AddModal: React.FC<AddModalProps> = ({ type, onClose, onConfirm }) => {
    const { isDarkMode } = useTheme();
    
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 animate-in zoom-in-90 duration-200 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/90'}`}>
          <div className={`p-8 max-w-md w-full mx-4 relative ${
             isDarkMode 
               ? 'bg-gray-900/60 backdrop-blur-2xl border border-white/20 text-white shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-2xl' 
               : 'bg-white border-4 border-black shadow-[16px_16px_0px_0px_#ff4444]'
          }`}>
            <button onClick={onClose} className={`absolute top-4 right-4 transition-transform hover:rotate-90 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'bg-black text-white p-1'}`}>
              <X size={28} strokeWidth={3} />
            </button>
            
            <h3 className="text-3xl font-black uppercase italic mb-2">
              New <span className={`${isDarkMode ? 'text-red-400' : 'text-[#ff4444]'}`}>{type}</span>
            </h3>
            <p className={`text-xs font-mono font-bold mb-8 inline-block px-2 py-1 ${isDarkMode ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/50 rounded' : 'bg-[#ffcc00] border-2 border-black text-black'}`}>
              STATUS: PENDING INPUT
            </p>
            
            <div className="space-y-5">
               <div>
                <label className="block text-sm font-black uppercase mb-3">Identifier</label>
                <input
                  type="text"
                  placeholder={`NAME YOUR ${type}`}
                  className={getInputStyle(isDarkMode)}
                />
              </div>
               <div>
                <label className="block text-sm font-black uppercase mb-3">Payload</label>
                <textarea
                  placeholder="PASTE CONFIG BLOB..."
                  className={`${getInputStyle(isDarkMode)} h-32 resize-none`}
                />
              </div>
            </div>
            <div className="flex gap-6 mt-10">
              <button onClick={onClose} className={`flex-1 py-3 text-sm font-black uppercase transition-all ${
                isDarkMode
                  ? 'bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg'
                  : 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] bg-gray-200 text-black'
              }`}>
                Cancel
              </button>
              <button onClick={onConfirm} className={`flex-1 ${getPrimaryButtonStyle(isDarkMode)} ${isDarkMode ? 'bg-red-600/80 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-[#ff4444]'}`}>
                Spawn
              </button>
            </div>
          </div>
        </div>
    );
}
