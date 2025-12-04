import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { getInputStyle, getPrimaryButtonStyle } from '../../utils/styles';
import { templatesApi, tenantTemplatesApi, credentialsApi } from '../../services/api';
import { MODULES } from '../../constants';
import { ModuleType } from '../../types';

interface AddModalProps {
    type: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const AddModal: React.FC<AddModalProps> = ({ type, onClose, onConfirm }) => {
    const { isDarkMode } = useTheme();
    const toast = useToast();
    
    // Common state
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Template specific state
    const [templateName, setTemplateName] = useState('');
    const [templateModule, setTemplateModule] = useState<ModuleType>('CLS');
    const [templateDescription, setTemplateDescription] = useState('');
    const [templateIcon, setTemplateIcon] = useState('🔌');
    const [templatePayload, setTemplatePayload] = useState('{}');
    
    // Tenant specific state
    const [tenantKey, setTenantKey] = useState('');
    const [tenantName, setTenantName] = useState('');
    const [tenantUrl, setTenantUrl] = useState('');
    const [tenantToken, setTenantToken] = useState('');
    const [tenantDescription, setTenantDescription] = useState('');
    
    // Credential specific state
    const [credentialKey, setCredentialKey] = useState('');
    const [credentialPayload, setCredentialPayload] = useState('{}');

    const handleSubmit = async () => {
        setIsSubmitting(true);
        
        try {
            if (type === 'template') {
                if (!templateName.trim()) {
                    toast.warning('Please enter a template name');
                    return;
                }
                
                let parsedTemplate;
                try {
                    parsedTemplate = JSON.parse(templatePayload);
                } catch {
                    toast.error('Invalid JSON payload');
                    return;
                }
                
                await templatesApi.addPlugin({
                    module: templateModule,
                    plugin_name: templateName,
                    description: templateDescription || `Template for ${templateName}`,
                    icon: templateIcon,
                    template: parsedTemplate,
                });
                
                toast.success(`Template "${templateName}" created!`);
                onConfirm();
                
            } else if (type === 'tenant') {
                if (!tenantKey.trim() || !tenantName.trim() || !tenantUrl.trim() || !tenantToken.trim()) {
                    toast.warning('Please fill in all required fields');
                    return;
                }
                
                await tenantTemplatesApi.add({
                    tenant_key: tenantKey,
                    name: tenantName,
                    url: tenantUrl,
                    token: tenantToken,
                    description: tenantDescription,
                });
                
                toast.success(`Tenant "${tenantName}" created!`);
                onConfirm();
                
            } else if (type === 'credential') {
                if (!credentialKey.trim()) {
                    toast.warning('Please enter a credential key');
                    return;
                }
                
                let parsedCredentials;
                try {
                    parsedCredentials = JSON.parse(credentialPayload);
                } catch {
                    toast.error('Invalid JSON payload');
                    return;
                }
                
                await credentialsApi.add({
                    credential_key: credentialKey,
                    credentials: parsedCredentials,
                });
                
                toast.success(`Credential "${credentialKey}" created!`);
                onConfirm();
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : `Failed to create ${type}`;
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderTemplateFields = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-black uppercase mb-3">Plugin Name *</label>
                <input
                    type="text"
                    placeholder="e.g. CROWDSTRIKE"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    className={getInputStyle(isDarkMode)}
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label className="block text-sm font-black uppercase mb-3">Module *</label>
                <select
                    value={templateModule}
                    onChange={(e) => setTemplateModule(e.target.value as ModuleType)}
                    className={getInputStyle(isDarkMode)}
                    disabled={isSubmitting}
                >
                    {MODULES.map((mod) => (
                        <option key={mod} value={mod}>{mod}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-black uppercase mb-3">Description</label>
                <input
                    type="text"
                    placeholder="Brief description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    className={getInputStyle(isDarkMode)}
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label className="block text-sm font-black uppercase mb-3">Icon (emoji)</label>
                <input
                    type="text"
                    placeholder="🔌"
                    value={templateIcon}
                    onChange={(e) => setTemplateIcon(e.target.value)}
                    className={`${getInputStyle(isDarkMode)} w-20`}
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label className="block text-sm font-black uppercase mb-3">Config Payload (JSON) *</label>
                <textarea
                    placeholder='{"api_key": "", "endpoint": ""}'
                    value={templatePayload}
                    onChange={(e) => setTemplatePayload(e.target.value)}
                    className={`${getInputStyle(isDarkMode)} h-32 resize-none font-mono text-sm`}
                    disabled={isSubmitting}
                />
            </div>
        </div>
    );

    const renderTenantFields = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-black uppercase mb-3">Tenant Key *</label>
                <input
                    type="text"
                    placeholder="unique-tenant-key"
                    value={tenantKey}
                    onChange={(e) => setTenantKey(e.target.value)}
                    className={getInputStyle(isDarkMode)}
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label className="block text-sm font-black uppercase mb-3">Name *</label>
                <input
                    type="text"
                    placeholder="Production Tenant"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    className={getInputStyle(isDarkMode)}
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label className="block text-sm font-black uppercase mb-3">URL *</label>
                <input
                    type="text"
                    placeholder="https://tenant.netskope.com"
                    value={tenantUrl}
                    onChange={(e) => setTenantUrl(e.target.value)}
                    className={getInputStyle(isDarkMode)}
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label className="block text-sm font-black uppercase mb-3">API Token *</label>
                <input
                    type="password"
                    placeholder="••••••••"
                    value={tenantToken}
                    onChange={(e) => setTenantToken(e.target.value)}
                    className={getInputStyle(isDarkMode)}
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label className="block text-sm font-black uppercase mb-3">Description</label>
                <input
                    type="text"
                    placeholder="Optional description"
                    value={tenantDescription}
                    onChange={(e) => setTenantDescription(e.target.value)}
                    className={getInputStyle(isDarkMode)}
                    disabled={isSubmitting}
                />
            </div>
        </div>
    );

    const renderCredentialFields = () => (
        <div className="space-y-5">
            <div>
                <label className="block text-sm font-black uppercase mb-3">Credential Key *</label>
                <input
                    type="text"
                    placeholder="aws-credentials"
                    value={credentialKey}
                    onChange={(e) => setCredentialKey(e.target.value)}
                    className={getInputStyle(isDarkMode)}
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label className="block text-sm font-black uppercase mb-3">Credentials (JSON) *</label>
                <textarea
                    placeholder='{"access_key": "", "secret_key": ""}'
                    value={credentialPayload}
                    onChange={(e) => setCredentialPayload(e.target.value)}
                    className={`${getInputStyle(isDarkMode)} h-40 resize-none font-mono text-sm`}
                    disabled={isSubmitting}
                />
            </div>
        </div>
    );
    
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 animate-in zoom-in-90 duration-200 ${isDarkMode ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/90'}`}>
          <div className={`p-8 max-w-md w-full mx-4 relative max-h-[90vh] overflow-y-auto custom-scrollbar ${
             isDarkMode 
               ? 'bg-gray-900/60 backdrop-blur-2xl border border-white/20 text-white shadow-[0_0_50px_rgba(239,68,68,0.2)] rounded-2xl' 
               : 'bg-white border-4 border-black shadow-[16px_16px_0px_0px_#ff4444]'
          }`}>
            <button 
              onClick={onClose} 
              disabled={isSubmitting}
              className={`absolute top-4 right-4 transition-transform hover:rotate-90 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'bg-black text-white p-1'}`}
            >
              <X size={28} strokeWidth={3} />
            </button>
            
            <h3 className="text-3xl font-black uppercase italic mb-2">
              New <span className={`${isDarkMode ? 'text-red-400' : 'text-[#ff4444]'}`}>{type}</span>
            </h3>
            <p className={`text-xs font-mono font-bold mb-8 inline-block px-2 py-1 ${isDarkMode ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/50 rounded' : 'bg-[#ffcc00] border-2 border-black text-black'}`}>
              STATUS: PENDING INPUT
            </p>
            
            {type === 'template' && renderTemplateFields()}
            {type === 'tenant' && renderTenantFields()}
            {type === 'credential' && renderCredentialFields()}

            <div className="flex gap-6 mt-10">
              <button 
                onClick={onClose} 
                disabled={isSubmitting}
                className={`flex-1 py-3 text-sm font-black uppercase transition-all ${
                  isDarkMode
                    ? 'bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg'
                    : 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] bg-gray-200 text-black'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className={`flex-1 ${getPrimaryButtonStyle(isDarkMode)} ${isDarkMode ? 'bg-red-600/80 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-[#ff4444]'} flex items-center justify-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </div>
        </div>
    );
}
