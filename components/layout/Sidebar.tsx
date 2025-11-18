import React, { useState } from 'react';
import { Home, FileText, Users, Key, Terminal, Shield, Monitor, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ViewState } from '../../types';

interface SidebarProps {
  activeSection: ViewState;
  setActiveSection: (section: ViewState) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isOpen }) => {
  const { isDarkMode, toggleTheme, isCrtMode, toggleCrt } = useTheme();

  const sidebarClass = isDarkMode 
    ? 'bg-black/30 backdrop-blur-xl border-r border-white/10' 
    : 'bg-[#ffde59] border-r-2 border-black';

  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Hub' },
    { id: 'templates' as const, icon: FileText, label: 'Blueprints' },
    { id: 'tenants' as const, icon: Users, label: 'Tenants' },
    { id: 'credentials' as const, icon: Key, label: 'Keys' },
  ];

  const getNavItemClass = (isActive: boolean) => {
      if (isActive) {
          return isDarkMode 
            ? 'bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
            : 'bg-[#88ccff] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 text-black';
      }
      return isDarkMode
        ? 'text-gray-400 hover:bg-white/5 hover:text-white rounded-xl'
        : 'bg-white border-2 border-black hover:bg-white shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 text-black';
  };

  return (
    <div className={`flex flex-col shrink-0 transition-all duration-300 ease-in-out z-20 ${sidebarClass} ${isOpen ? 'w-72' : 'w-20'}`}>
      <div className={`h-[70px] flex items-center ${isDarkMode ? 'border-b border-white/10' : 'border-b-2 border-black bg-white'} ${isOpen ? 'px-6' : 'justify-center'}`}>
        {isOpen ? (
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className={`p-1.5 ${isDarkMode ? 'bg-purple-600 rounded-md shadow-[0_0_10px_#9333ea]' : 'bg-black text-white group-hover:animate-pulse'}`}>
              <Terminal size={24} strokeWidth={3} className="text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-black uppercase italic tracking-tighter group-hover:text-[#8b5cf6] transition-colors ${isDarkMode ? 'text-white' : 'text-black'}`}>Netskope<span className="text-[#8b5cf6] text-3xl">.CE</span></h1>
            </div>
          </div>
        ) : (
           <div className={`${isDarkMode ? 'bg-purple-600 p-2 rounded-md' : 'bg-black text-white p-2 border-2 border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]'}`}>
             <Shield size={24} strokeWidth={3} className="text-white" />
           </div>
        )}
      </div>
      
      <nav className="flex-1 p-5 space-y-4 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            title={item.label}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center space-x-4 p-3 transition-all group ${isOpen ? '' : 'justify-center'} ${getNavItemClass(activeSection === item.id)}`}
          >
            <item.icon size={22} strokeWidth={2.5} className={`transition-transform group-hover:rotate-12 ${activeSection === item.id ? (isDarkMode ? 'text-purple-400' : 'text-black') : ''}`} />
            {isOpen && <span className="font-black uppercase tracking-wide text-base">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className={`p-5 space-y-4 ${isDarkMode ? 'border-t border-white/10' : 'border-t-2 border-black bg-white'}`}>
         <button
          onClick={toggleCrt}
          className={`w-full flex items-center justify-center space-x-2 p-3 transition-all ${isOpen ? '' : 'px-0'} ${
            isDarkMode 
              ? `${isCrtMode ? 'bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg' : 'bg-white/5 text-gray-400 rounded-lg hover:bg-white/10'}` 
              : `border-2 border-black ${isCrtMode ? 'bg-[#00ff00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-gray-100 text-gray-400 shadow-none hover:bg-gray-200'}`
          }`}
        >
          <Monitor size={20} strokeWidth={3} />
          {isOpen && <span className="font-black uppercase">CRT: {isCrtMode ? 'ON' : 'OFF'}</span>}
        </button>

        <button
          onClick={toggleTheme}
          className={`w-full flex items-center justify-center space-x-2 p-3 transition-all ${
            isDarkMode 
              ? 'bg-white/10 text-white rounded-lg hover:bg-white/20 border border-white/10' 
              : 'border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-black text-white'
          }`}
        >
          {isDarkMode ? <Sun size={20} strokeWidth={3} /> : <Moon size={20} strokeWidth={3} />}
          {isOpen && <span className="font-black uppercase">{isDarkMode ? 'LIGHT' : 'DARK'}</span>}
        </button>
      </div>
    </div>
  );
};
