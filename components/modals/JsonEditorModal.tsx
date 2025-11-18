import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface JsonEditorModalProps {
  item: any;
  onClose: () => void;
  onSave: (content: string) => void;
}

export const JsonEditorModal: React.FC<JsonEditorModalProps> = ({ item, onClose, onSave }) => {
  const { isDarkMode } = useTheme();
  const [jsonContent, setJsonContent] = useState(JSON.stringify(item.config || item, null, 2));

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 animate-in slide-in-from-bottom-10 duration-300 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/90'}`}>
      <div className={`p-6 max-w-2xl w-full mx-4 h-[85vh] flex flex-col relative ${
        isDarkMode
          ? 'bg-black/80 backdrop-blur-xl border border-white/20 shadow-[0_0_50px_rgba(255,204,0,0.2)] rounded-2xl'
          : 'bg-white border-4 border-black shadow-[16px_16px_0px_0px_#ffcc00]'
      }`}>
         <div className={`flex justify-between items-center mb-6 pb-4 ${isDarkMode ? 'border-b border-white/10' : 'border-b-4 border-black'}`}>
            <h3 className={`text-3xl font-black uppercase ${isDarkMode ? 'text-white' : 'text-black'}`}>Raw Editor</h3>
            <button onClick={onClose} className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'bg-black text-white p-1 hover:scale-110 transition-transform'}`}>
              <X size={28} strokeWidth={3} />
            </button>
        </div>
        <div className={`flex-1 relative overflow-hidden ${isDarkMode ? 'bg-black/50 border border-white/10 rounded-lg' : 'bg-[#111] border-4 border-black shadow-[inset_0_0_20px_rgba(0,0,0,1)]'}`}>
           <textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className={`w-full h-full bg-transparent p-6 font-mono text-sm resize-none focus:outline-none leading-relaxed ${isDarkMode ? 'text-green-400' : 'text-[#00ff00]'}`}
            spellCheck="false"
          />
        </div>
        <div className="flex gap-4 mt-6">
          <button onClick={onClose} className={`px-8 py-3 text-sm font-black uppercase transition-all ${
            isDarkMode
              ? 'bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-white'
              : 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] bg-white text-black'
          }`}>
            Close
          </button>
          <button onClick={() => onSave(jsonContent)} className={`flex-1 px-4 py-3 text-sm font-black uppercase transition-all ${
            isDarkMode
              ? 'bg-yellow-500/80 hover:bg-yellow-500 text-black rounded-lg shadow-[0_0_15px_rgba(234,179,8,0.4)]'
              : 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] bg-[#ffcc00] text-black'
          }`}>
            Commit Changes
          </button>
        </div>
      </div>
    </div>
  );
};
