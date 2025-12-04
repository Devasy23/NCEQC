import React, { useState } from 'react';
import { Menu, Zap, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useConnection } from '../../context/ConnectionContext';
import { useToast } from '../../context/ToastContext';
import { getPrimaryButtonStyle, getIconButtonStyle } from '../../utils/styles';

interface TopBarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
    const { isDarkMode } = useTheme();
    const { isConnected, isConnecting, vmIp: connectedVmIp, connect, disconnect } = useConnection();
    const toast = useToast();
    const [vmIp, setVmIp] = useState('');
    const [password, setPassword] = useState('');

    const handleConnect = async () => {
        if (isConnected) {
            disconnect();
            toast.info('Disconnected from CE instance');
            setVmIp('');
            setPassword('');
            return;
        }

        if (!vmIp || !password) {
            toast.warning('Please enter VM IP and password');
            return;
        }

        const success = await connect(vmIp, password);
        if (success) {
            toast.success(`Connected to ${vmIp}`);
        } else {
            toast.error('Failed to connect to CE instance');
        }
    };

    const vmBoxClass = isDarkMode
        ? 'flex-1 flex items-center space-x-3 p-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg'
        : 'flex-1 flex items-center space-x-3 p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#e0e7ff]';

    const inputClass = `bg-transparent border-none focus:outline-none font-mono text-sm w-40 font-bold uppercase ${isDarkMode ? 'text-white placeholder-white/40' : 'text-black placeholder-gray-500'}`;

    const getConnectButtonStyle = () => {
        if (isConnected) {
            return isDarkMode
                ? 'px-6 py-2.5 font-black text-sm uppercase bg-red-600/80 hover:bg-red-500/80 text-white rounded-lg border border-red-400/30 shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all'
                : 'px-6 py-2.5 font-black text-sm uppercase bg-[#ff4444] hover:bg-red-600 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all';
        }
        return getPrimaryButtonStyle(isDarkMode);
    };

    return (
        <div className={`h-[70px] px-8 flex items-center space-x-4 shrink-0 z-10 ${isDarkMode ? 'bg-transparent backdrop-blur-none' : 'bg-white border-b-2 border-black'}`}>
            <button
                onClick={toggleSidebar}
                className={getIconButtonStyle(isDarkMode, 'bg-[#ffcc00] text-black')}
                title="Toggle Sidebar"
            >
                <Menu size={20} strokeWidth={3} />
            </button>

            <div className={vmBoxClass}>
                <div className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'bg-purple-600 rounded-md text-white' : 'bg-black text-white'}`}>
                    <Zap size={14} className="fill-current" /> VM
                </div>
                <input
                    type="text"
                    placeholder="VM IP ADDRESS"
                    value={isConnected ? connectedVmIp || '' : vmIp}
                    onChange={(e) => setVmIp(e.target.value)}
                    disabled={isConnected || isConnecting}
                    className={`${inputClass} ${isConnected ? 'opacity-60' : ''}`}
                />
                <div className={`w-[2px] h-5 ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
                <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isConnected || isConnecting}
                    className={`${inputClass} ${isConnected ? 'opacity-60' : ''}`}
                />
                {isConnected && (
                    <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-bold ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                        <Wifi size={14} />
                        CONNECTED
                    </div>
                )}
            </div>

            <button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className={`${getConnectButtonStyle()} flex items-center gap-2`}
            >
                {isConnecting ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Connecting...
                    </>
                ) : isConnected ? (
                    <>
                        <WifiOff size={16} />
                        Disconnect
                    </>
                ) : (
                    'Connect'
                )}
            </button>
        </div>
    );
};
