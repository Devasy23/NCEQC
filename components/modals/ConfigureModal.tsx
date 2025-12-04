import React, { useState, useEffect, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useConnection } from '../../context/ConnectionContext';
import { useToast } from '../../context/ToastContext';
import { Plugin, Tenant } from '../../types';
import { getInputStyle, getPrimaryButtonStyle } from '../../utils/styles';
import { pluginsApi, tenantTemplatesApi, TenantTemplate } from '../../services/api';

interface ConfigureModalProps {
  plugin: Plugin;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfigureModal: React.FC<ConfigureModalProps> = ({ plugin, onClose, onConfirm }) => {
  const { isDarkMode } = useTheme();
  const { connectionId } = useConnection();
  const toast = useToast();
  
  const [configName, setConfigName] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  // Fetch tenants for netskope plugins
  const fetchTenants = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await tenantTemplatesApi.getAll();
      const tenantsList: Tenant[] = Object.entries(response).map(([key, tenant]) => ({
        id: key,
        name: (tenant as TenantTemplate).name,
        url: (tenant as TenantTemplate).url,
        apiKey: (tenant as TenantTemplate).token,
      }));
      setTenants(tenantsList);
    } catch (error) {
      toast.error('Failed to load tenants');
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (plugin.type === 'netskope') {
      fetchTenants();
    }
  }, [plugin.type, fetchTenants]);

  const handleDeploy = async () => {
    if (!configName.trim()) {
      toast.warning('Please enter a config name');
      return;
    }

    if (plugin.type === 'netskope' && !selectedTenant) {
      toast.warning('Please select a tenant');
      return;
    }

    if (!connectionId) {
      toast.error('Not connected to CE instance');
      return;
    }

    setIsDeploying(true);
    try {
      await pluginsApi.configure(connectionId, {
        name: configName,
        plugin_data: plugin.template || {},
        tenant: plugin.type === 'netskope' ? selectedTenant : null,
      });
      
      toast.success(`${plugin.name} configured successfully!`);
      onConfirm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to configure plugin';
      toast.error(message);
    } finally {
      setIsDeploying(false);
    }
  };

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
        
        <h3 className="text-3xl font-black uppercase italic mb-2">
          Config <span className={`${isDarkMode ? 'text-purple-400' : 'text-[#8b5cf6]'}`}>Wizard</span>
        </h3>
        <p className={`text-sm font-bold mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Configuring: {plugin.name}
        </p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-black uppercase mb-3">Config Name</label>
            <input
              type="text"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              placeholder="ENTER UNIQUE ID"
              className={getInputStyle(isDarkMode)}
              disabled={isDeploying}
            />
          </div>
          {plugin.type === 'netskope' && (
            <div>
              <label className="block text-sm font-black uppercase mb-3">Target Tenant</label>
              {isLoading ? (
                <div className="flex items-center gap-2 py-3">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm">Loading tenants...</span>
                </div>
              ) : (
                <select
                  value={selectedTenant}
                  onChange={(e) => setSelectedTenant(e.target.value)}
                  className={getInputStyle(isDarkMode)}
                  disabled={isDeploying}
                >
                  <option value="">SELECT TARGET...</option>
                  {tenants.map((tenant) => (
                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-6 mt-10">
          <button 
            onClick={onClose} 
            disabled={isDeploying}
            className={`flex-1 py-3 text-sm font-black uppercase transition-all ${
              isDarkMode 
                ? 'bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg' 
                : 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] bg-gray-200 text-black'
            } ${isDeploying ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Abort
          </button>
          <button 
            onClick={handleDeploy} 
            disabled={isDeploying}
            className={`flex-1 ${getPrimaryButtonStyle(isDarkMode)} flex items-center justify-center gap-2 ${isDeploying ? 'opacity-75' : ''}`}
          >
            {isDeploying ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deploying...
              </>
            ) : (
              'Deploy'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
