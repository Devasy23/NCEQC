import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Settings, FileText, Edit2, Trash2, Plus, Users, Key, Loader2, WifiOff, RefreshCw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useConnection } from '../context/ConnectionContext';
import { useToast } from '../context/ToastContext';
import { ModuleType, ViewState, Plugin, Template, Tenant, Credential } from '../types';
import { MODULES } from '../constants';
import { TiltCard } from './ui/TiltCard';
import { getCardStyle, getHeaderStyle, getIconButtonStyle } from '../utils/styles';
import { templatesApi, tenantTemplatesApi, credentialsApi, PluginTemplateData } from '../services/api';

interface DashboardProps {
    activeSection: ViewState;
    activeModule: ModuleType;
    setActiveModule: (m: ModuleType) => void;
    onConfigure: (p: Plugin) => void;
    onAdd: (type: string) => void;
    onEdit: (item: any, type: string) => void;
    onDelete: (item: any, type: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
    activeSection, activeModule, setActiveModule, onConfigure, onAdd, onEdit, onDelete
}) => {
    const { isDarkMode } = useTheme();
    const { isConnected } = useConnection();
    const toast = useToast();

    // Data states
    const [plugins, setPlugins] = useState<Record<ModuleType, Plugin[]>>({
        CLS: [], CTO: [], CTE: [], CRE: [], EDM: [], CFC: []
    });
    const [templates, setTemplates] = useState<Template[]>([]);
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [credentials, setCredentials] = useState<Credential[]>([]);
    
    // Loading states
    const [loadingPlugins, setLoadingPlugins] = useState(false);
    const [loadingTenants, setLoadingTenants] = useState(false);
    const [loadingCredentials, setLoadingCredentials] = useState(false);
    
    // Track if we've already tried fetching (to prevent infinite loops on error)
    const [hasFetchedTemplates, setHasFetchedTemplates] = useState(false);
    const [hasFetchedTenants, setHasFetchedTenants] = useState(false);
    const [hasFetchedCredentials, setHasFetchedCredentials] = useState(false);

    // Fetch plugin templates (for Hub page)
    const fetchPluginTemplates = useCallback(async (showErrors = true) => {
        setLoadingPlugins(true);
        try {
            const response = await templatesApi.getAll();
            const pluginsByModule: Record<ModuleType, Plugin[]> = {
                CLS: [], CTO: [], CTE: [], CRE: [], EDM: [], CFC: []
            };
            const templatesList: Template[] = [];

            // Response format: { plugin_templates: { MODULE: { plugin_name: { icon, description, color, template } } } }
            if (response.plugin_templates) {
                Object.entries(response.plugin_templates).forEach(([module, modulePlugins]) => {
                    const moduleKey = module.toUpperCase() as ModuleType;
                    if (MODULES.includes(moduleKey)) {
                        // modulePlugins is { plugin_name: { icon, description, color, template } }
                        Object.entries(modulePlugins as Record<string, PluginTemplateData>).forEach(([pluginName, pluginData], index) => {
                            // Add to plugins for Hub
                            pluginsByModule[moduleKey].push({
                                id: `${module}-${index}`,
                                name: pluginName,
                                type: pluginName.toLowerCase().includes('netskope') ? 'netskope' : 'third-party',
                                description: pluginData.description,
                                icon: pluginData.icon,
                                color: pluginData.color,
                                template: pluginData.template,
                            });
                            // Add to templates for Templates page
                            templatesList.push({
                                id: `${module}-${pluginName}`,
                                name: pluginName,
                                module: moduleKey,
                                config: pluginData.template,
                                description: pluginData.description,
                                icon: pluginData.icon,
                                color: pluginData.color,
                            });
                        });
                    }
                });
            }

            setPlugins(pluginsByModule);
            setTemplates(templatesList);
        } catch (error) {
            if (showErrors) {
                toast.error('Failed to load plugin templates');
            }
            console.error('Error fetching templates:', error);
        } finally {
            setLoadingPlugins(false);
            setHasFetchedTemplates(true);
        }
    }, []);

    // Fetch tenant templates
    const fetchTenants = useCallback(async (showErrors = true) => {
        setLoadingTenants(true);
        try {
            const response = await tenantTemplatesApi.getAll();
            // Response format: { tenants: { tenant_key: { name, url, token, description } } }
            const tenantsList: Tenant[] = Object.entries(response.tenants || {}).map(([key, tenant]) => ({
                id: key,
                name: tenant.name,
                url: tenant.url,
                apiKey: tenant.token,
                description: tenant.description,
            }));
            setTenants(tenantsList);
        } catch (error) {
            if (showErrors) {
                toast.error('Failed to load tenants');
            }
            console.error('Error fetching tenants:', error);
        } finally {
            setLoadingTenants(false);
            setHasFetchedTenants(true);
        }
    }, []);

    // Fetch credentials
    const fetchCredentials = useCallback(async (showErrors = true) => {
        setLoadingCredentials(true);
        try {
            const response = await credentialsApi.getAll();
            // Response format: { plugin_credentials: { key: { credentials } } }
            const credentialsList: Credential[] = Object.entries(response.plugin_credentials || {}).map(([key, cred]) => ({
                id: key,
                name: key,
                type: 'Credential Set',
                value: JSON.stringify(cred),
                credentials: cred as Record<string, any>,
            }));
            setCredentials(credentialsList);
        } catch (error) {
            if (showErrors) {
                toast.error('Failed to load credentials');
            }
            console.error('Error fetching credentials:', error);
        } finally {
            setLoadingCredentials(false);
            setHasFetchedCredentials(true);
        }
    }, []);

    // Load data based on active section - only fetch once per section
    useEffect(() => {
        if ((activeSection === 'home' || activeSection === 'templates') && !hasFetchedTemplates) {
            fetchPluginTemplates();
        } else if (activeSection === 'tenants' && !hasFetchedTenants) {
            fetchTenants();
        } else if (activeSection === 'credentials' && !hasFetchedCredentials) {
            fetchCredentials();
        }
    }, [activeSection, hasFetchedTemplates, hasFetchedTenants, hasFetchedCredentials, fetchPluginTemplates, fetchTenants, fetchCredentials]);

    // --- Module Selector ---
    const renderModuleSelector = () => (
        <div className="mb-8 flex flex-wrap gap-3">
            {MODULES.map((module) => (
                <button
                    key={module}
                    onClick={() => setActiveModule(module)}
                    className={`px-6 py-3 font-black text-sm uppercase tracking-wider transition-all transform duration-150 ${
                        activeModule === module
                            ? isDarkMode
                                ? 'bg-pink-500/80 backdrop-blur-lg text-white rounded-lg shadow-[0_0_20px_rgba(236,72,153,0.4)] scale-105 border border-pink-400/30'
                                : 'bg-[#ff4444] text-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] -translate-y-1 scale-105'
                            : isDarkMode
                                ? 'bg-white/5 text-gray-400 border border-white/5 rounded-lg hover:bg-white/10'
                                : 'bg-white text-gray-600 border-2 border-black hover:bg-gray-100 shadow-none hover:-translate-y-0.5'
                    }`}
                >
                    {module}
                </button>
            ))}
        </div>
    );

    // --- Loading State ---
    const renderLoading = () => (
        <div className="flex items-center justify-center py-20">
            <Loader2 size={48} className={`animate-spin ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
        </div>
    );

    // --- Empty State ---
    const renderEmpty = (type: string) => (
        <div className={`flex flex-col items-center justify-center py-20 rounded-xl ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border-2 border-dashed border-gray-300'}`}>
            <div className={`p-4 mb-4 rounded-xl ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                {type === 'plugin' && <Settings size={48} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />}
                {type === 'template' && <FileText size={48} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />}
                {type === 'tenant' && <Users size={48} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />}
                {type === 'credential' && <Key size={48} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />}
            </div>
            <h4 className={`text-xl font-black uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No {type}s Found</h4>
            <p className={`text-center font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Click the + button to add a new {type}.
            </p>
        </div>
    );

    // --- Disconnected State for Hub ---
    const renderDisconnectedHub = () => (
        <div className="pb-10">
            <div className={getHeaderStyle(isDarkMode)}>
                <div className="flex items-baseline gap-2">
                    <h3 className={`text-4xl font-black uppercase italic tracking-tighter drop-shadow-sm ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400' : 'text-black'}`}>
                        Quick <span className={`${isDarkMode ? 'text-purple-400' : 'text-[#8b5cf6]'}`}>Config</span>
                    </h3>
                    <Activity className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <span className={`font-mono text-sm font-bold px-3 py-1 ${isDarkMode ? 'bg-red-500/20 text-red-400 border border-red-500/30 rounded' : 'bg-red-100 text-red-600 border-2 border-red-300'}`}>STATUS: DISCONNECTED</span>
            </div>

            <div className={`flex flex-col items-center justify-center py-20 rounded-xl ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border-2 border-gray-300'}`}>
                <WifiOff size={64} className={`mb-6 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h4 className={`text-2xl font-black uppercase mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Not Connected</h4>
                <p className={`text-center font-bold max-w-md ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Connect to a CloudExchange instance using the top bar to configure plugins.
                </p>
            </div>
        </div>
    );

    // --- Home View ---
    const renderHome = () => {
        if (!isConnected) {
            return renderDisconnectedHub();
        }

        if (loadingPlugins) {
            return renderLoading();
        }

        const modulePlugins = plugins[activeModule] || [];

        return (
            <div className="pb-10">
                <div className={getHeaderStyle(isDarkMode)}>
                    <div className="flex items-baseline gap-2">
                        <h3 className={`text-4xl font-black uppercase italic tracking-tighter drop-shadow-sm ${isDarkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400' : 'text-black'}`}>
                            Quick <span className={`${isDarkMode ? 'text-purple-400' : 'text-[#8b5cf6]'}`}>Config</span>
                        </h3>
                        <Activity className={`${isDarkMode ? 'text-pink-400' : 'text-[#ff4444]'} animate-pulse`} />
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => { setHasFetchedTemplates(false); fetchPluginTemplates(); }}
                            className={getIconButtonStyle(isDarkMode, 'bg-[#88ccff] text-black')}
                            title="Refresh"
                        >
                            <RefreshCw size={24} strokeWidth={3} />
                        </button>
                        <span className={`font-mono text-sm font-bold px-3 py-1 ${isDarkMode ? 'bg-green-500/20 text-green-400 border border-green-500/30 rounded' : 'bg-black text-[#00ff00] border-2 border-transparent'}`}>STATUS: READY</span>
                    </div>
                </div>

                {modulePlugins.length === 0 ? (
                    renderEmpty('plugin')
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                        {modulePlugins.map((plugin) => (
                            <TiltCard key={plugin.id} className="">
                                <div className={getCardStyle(isDarkMode)}>
                                    <div className={`p-2 flex justify-between items-center ${isDarkMode ? 'border-b border-white/10 bg-white/5' : `border-b-2 border-black ${plugin.type === 'netskope' ? 'bg-[#88ccff] text-black' : 'bg-[#ffde59] text-black'}`}`}>
                                        <span className="text-[10px] font-black uppercase">{plugin.type === 'netskope' ? 'INTERNAL' : '3RD PARTY'}</span>
                                        <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : 'bg-black'}`}></div>
                                    </div>
                                    <div className="p-6 flex flex-col items-center justify-between flex-1 relative overflow-hidden">
                                        {isDarkMode && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>}

                                        {plugin.icon ? (
                                            <span className="text-4xl mb-4 z-10">{plugin.icon}</span>
                                        ) : (
                                            <Settings className={`mb-4 z-10 ${isDarkMode ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-black'}`} size={42} strokeWidth={1.5} />
                                        )}
                                        <h4 className="text-xl font-black mb-4 text-center leading-tight uppercase z-10">{plugin.name}</h4>
                                        <button
                                            onClick={() => onConfigure(plugin)}
                                            className={`w-full py-2 text-xs font-black uppercase transition-all active:scale-95 z-10 ${isDarkMode
                                                    ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg backdrop-blur-md'
                                                    : 'border-2 border-black hover:bg-black hover:text-white bg-[#ff88cc] text-black'
                                                }`}
                                        >
                                            Configure
                                        </button>
                                    </div>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // --- Templates View ---
    const renderTemplates = () => {
        if (loadingPlugins) {
            return renderLoading();
        }

        const moduleTemplates = templates.filter(t => t.module === activeModule);

        return (
            <div>
                <div className={getHeaderStyle(isDarkMode)}>
                    <h3 className={`text-4xl font-black uppercase italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>Templates</h3>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => { setHasFetchedTemplates(false); fetchPluginTemplates(); }}
                            className={getIconButtonStyle(isDarkMode, 'bg-[#88ccff] text-black')}
                            title="Refresh"
                        >
                            <RefreshCw size={24} strokeWidth={3} />
                        </button>
                        <button onClick={() => onAdd('template')} className={getIconButtonStyle(isDarkMode, 'bg-[#88ccff] text-black')}>
                            <Plus size={24} strokeWidth={3} />
                        </button>
                    </div>
                </div>
                
                {moduleTemplates.length === 0 ? (
                    renderEmpty('template')
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {moduleTemplates.map((template) => (
                            <TiltCard key={template.id}>
                                <div className={`${getCardStyle(isDarkMode)} flex-row`}>
                                    <div className={`w-16 flex items-center justify-center ${isDarkMode ? 'bg-white/5 border-r border-white/10' : 'bg-[#ffde59] border-r-2 border-black'}`}>
                                        {template.icon ? (
                                            <span className="text-2xl">{template.icon}</span>
                                        ) : (
                                            <FileText className={isDarkMode ? 'text-yellow-300' : 'text-black'} size={28} strokeWidth={2.5} />
                                        )}
                                    </div>
                                    <div className="p-4 flex-1">
                                        <h4 className="font-black text-lg uppercase leading-none mb-3">{template.name}</h4>
                                        <span className={`inline-block px-2 py-1 text-[10px] font-mono font-bold mb-4 ${isDarkMode ? 'bg-white/10 text-gray-300 rounded border border-white/10' : 'border border-black bg-black text-white'}`}>
                                            MOD: {template.module}
                                        </span>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => onEdit(template, 'template')} 
                                                className={getIconButtonStyle(isDarkMode, 'bg-white text-black')}
                                                title="Edit Template"
                                            >
                                                <Edit2 size={18} strokeWidth={2.5} />
                                            </button>
                                            <button 
                                                onClick={() => onDelete(template, 'template')} 
                                                className={getIconButtonStyle(isDarkMode, 'bg-[#ff4444] text-white')}
                                                title="Delete Template"
                                            >
                                                <Trash2 size={18} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // --- Tenants View ---
    const renderTenants = () => {
        if (loadingTenants) {
            return renderLoading();
        }

        return (
            <div>
                <div className={getHeaderStyle(isDarkMode)}>
                    <h3 className={`text-4xl font-black uppercase italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>Tenants</h3>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => { setHasFetchedTenants(false); fetchTenants(); }}
                            className={getIconButtonStyle(isDarkMode, 'bg-[#88ccff] text-black')}
                            title="Refresh"
                        >
                            <RefreshCw size={24} strokeWidth={3} />
                        </button>
                        <button onClick={() => onAdd('tenant')} className={getIconButtonStyle(isDarkMode, 'bg-[#88ccff] text-black')}>
                            <Plus size={24} strokeWidth={3} />
                        </button>
                    </div>
                </div>
                
                {tenants.length === 0 ? (
                    renderEmpty('tenant')
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {tenants.map((tenant) => (
                            <TiltCard key={tenant.id}>
                                <div className={`${getCardStyle(isDarkMode)} h-auto p-0 flex-row items-center justify-between group ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-[#f0f0f0]'}`}>
                                    <div className="flex items-center gap-6 p-6 flex-1">
                                        <div className={`p-4 transition-transform group-hover:rotate-3 ${isDarkMode ? 'bg-blue-600/50 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30' : 'bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_#88ccff]'}`}>
                                            <Users size={28} className={isDarkMode ? 'text-white' : ''} />
                                        </div>
                                        <div>
                                            <h4 className="font-black uppercase text-2xl">{tenant.name}</h4>
                                            <p className={`font-mono text-sm font-bold mt-1 inline-block px-1 ${isDarkMode ? 'text-gray-400 bg-white/5 rounded' : 'text-gray-500 bg-gray-100'}`}>{tenant.url}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 pr-6">
                                        <button 
                                            onClick={() => onEdit(tenant, 'tenant')} 
                                            className={getIconButtonStyle(isDarkMode, 'bg-[#ffcc00] text-black')}
                                            title="Edit Tenant"
                                        >
                                            <Edit2 size={20} strokeWidth={2.5} />
                                        </button>
                                        <button 
                                            onClick={() => onDelete(tenant, 'tenant')} 
                                            className={getIconButtonStyle(isDarkMode, 'bg-[#ff4444] text-white')}
                                            title="Delete Tenant"
                                        >
                                            <Trash2 size={20} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // --- Credentials View ---
    const renderCredentials = () => {
        if (loadingCredentials) {
            return renderLoading();
        }

        return (
            <div>
                <div className={getHeaderStyle(isDarkMode)}>
                    <h3 className={`text-4xl font-black uppercase italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-black'}`}>Credentials</h3>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => { setHasFetchedCredentials(false); fetchCredentials(); }}
                            className={getIconButtonStyle(isDarkMode, 'bg-[#88ccff] text-black')}
                            title="Refresh"
                        >
                            <RefreshCw size={24} strokeWidth={3} />
                        </button>
                        <button onClick={() => onAdd('credential')} className={getIconButtonStyle(isDarkMode, 'bg-[#88ccff] text-black')}>
                            <Plus size={24} strokeWidth={3} />
                        </button>
                    </div>
                </div>
                
                {credentials.length === 0 ? (
                    renderEmpty('credential')
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {credentials.map((cred) => (
                            <TiltCard key={cred.id}>
                                <div className={getCardStyle(isDarkMode)}>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-3 ${isDarkMode ? 'bg-red-500/50 rounded-lg border border-red-400/30 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-[#ff4444] text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}>
                                                <Key size={24} strokeWidth={2.5} className={isDarkMode ? 'text-white' : ''} />
                                            </div>
                                            <span className={`px-2 py-1 text-[10px] font-mono font-bold uppercase ${isDarkMode ? 'bg-white/10 text-white border border-white/10 rounded' : 'border-2 border-black bg-black text-white'}`}>
                                                TYPE: {cred.type}
                                            </span>
                                        </div>
                                        <h4 className="text-2xl font-black uppercase leading-tight mb-8">{cred.name}</h4>

                                        <div className={`flex gap-3 pt-5 ${isDarkMode ? 'border-t border-white/10' : 'border-t-2 border-black border-dashed'}`}>
                                            <button 
                                                onClick={() => onEdit(cred, 'credential')} 
                                                className={`flex-1 text-sm font-black uppercase ${getIconButtonStyle(isDarkMode, 'bg-[#ffde59] text-black')}`}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => onDelete(cred, 'credential')} 
                                                className={`flex-1 text-sm font-black uppercase ${getIconButtonStyle(isDarkMode, 'bg-[#ff4444] text-white')}`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-auto relative z-0 p-8 pt-4 custom-scrollbar">
            {(activeSection === 'home' || activeSection === 'templates') && renderModuleSelector()}
            {activeSection === 'home' && renderHome()}
            {activeSection === 'templates' && renderTemplates()}
            {activeSection === 'tenants' && renderTenants()}
            {activeSection === 'credentials' && renderCredentials()}
        </div>
    );
};
