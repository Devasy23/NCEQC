import React, { useState } from 'react';
import { Menu, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getPrimaryButtonStyle, getIconButtonStyle } from '../../utils/styles';

interface TopBarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    onVmSubmit: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleSidebar, onVmSubmit }) => {
    const { isDarkMode } = useTheme();
    const [vmIp, setVmIp] = useState('');
    const [password, setPassword] = useState('');

    const vmBoxClass = isDarkMode
        ? 'flex-1 flex items-center space-x-3 p-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg'
        : 'flex-1 flex items-center space-x-3 p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-[#e0e7ff]';

    const inputClass = `bg-transparent border-none focus:outline-none font-mono text-sm w-40 font-bold uppercase ${isDarkMode ? 'text-white placeholder-white/40' : 'text-black placeholder-gray-500'}`;

    return (
        <div className={`px-8 py-4 flex items-center space-x-4 shrink-0 z-10 ${isDarkMode ? 'bg-transparent backdrop-blur-none' : 'bg-white border-b-2 border-black'}`}>
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
                    value={vmIp}
                    onChange={(e) => setVmIp(e.target.value)}
                    className={inputClass}
                />
                <div className={`w-[2px] h-5 ${isDarkMode ? 'bg-white/20' : 'bg-black/20'}`}></div>
                <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                />
            </div>

            <button onClick={onVmSubmit} className={getPrimaryButtonStyle(isDarkMode)}>
                Connect
            </button>
        </div>
    );
};
