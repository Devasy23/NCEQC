import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Plugin, Tenant } from '../../types';
import { getInputStyle, getPrimaryButtonStyle } from '../../utils/styles';

interface ConfigureModalProps {
  plugin: Plugin;
  tenants: Tenant[];
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfigureModal: React.FC<ConfigureModalProps> = ({ plugin, tenants, onClose, onConfirm }) => {
  const { isDarkMode } = useTheme();
  const [configName, setConfigName] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('');

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 animate-in fade-in zoom-in duration-200 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/90'}`}>
      <div className={`p-10 max-w-md w-full mx-4 relative ${
        isDarkMode 
          ? 'bg-gray-900/60 backdrop-blur-2xl border border-white/20 text-white shadow-[0_0_50px_rgba(139,92,246,0.2)] rounded-2xl' 
          : 'bg-white border-4 border-black shadow-[16px_16px_0px_0px_#8b5cf6]'
      }`}>
        <button onClick={onClose} className={`absolute top-4 right-4 transition-transform hover:rotate-90 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'bg-black text-white p-1 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.5)]'}`}>
          <X size={28} strokeWidth={3} />
        </button>
        
        <h3 className="text-3xl font-black uppercase italic mb-8">
          Config <span className={`${isDarkMode ? 'text-purple-400' : 'text-[#8b5cf6]'}`}>Wizard</span>
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black uppercase mb-3">Config Name</label>
            <input
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              placeholder="ENTER UNIQUE ID"
              className={getInputStyle(isDarkMode)}
            />
          </div>
          {plugin.type === 'netskope' && (
            <div>
              <label className="block text-sm font-black uppercase mb-3">Target Tenant</label>
              <select
                value={selectedTenant}
                onChange={(e) => setSelectedTenant(e.target.value)}
                className={getInputStyle(isDarkMode)}
              >
                <option value="">SELECT TARGET...</option>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-6 mt-10">
          <button onClick={onClose} className={`flex-1 py-3 text-sm font-black uppercase transition-all ${
            isDarkMode 
              ? 'bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg' 
              : 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] bg-gray-200 text-black'
          }`}>
            Abort
          </button>
          <button onClick={onConfirm} className={`flex-1 ${getPrimaryButtonStyle(isDarkMode)}`}>
            Deploy
          </button>
        </div>
      </div>
    </div>
  );
};
