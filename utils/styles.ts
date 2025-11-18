export const getCardStyle = (isDark: boolean) => {
  return isDark
    ? 'relative h-full flex flex-col bg-white/5 backdrop-blur-lg border border-white/10 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-xl overflow-hidden hover:bg-white/10 transition-all'
    : 'relative h-full flex flex-col bg-white text-black border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]';
};

export const getPrimaryButtonStyle = (isDark: boolean) => {
  return isDark
    ? 'px-6 py-2 text-sm font-black uppercase tracking-wider bg-purple-600/80 backdrop-blur-md hover:bg-purple-500 text-white rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all active:scale-95'
    : 'px-6 py-2 text-sm font-black uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all bg-[#8b5cf6] text-white';
};

export const getIconButtonStyle = (isDark: boolean, lightColor = 'bg-white') => {
  return isDark
    ? 'p-2 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-lg hover:bg-white/20 transition-all'
    : `p-2 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all ${lightColor}`;
};

export const getInputStyle = (isDark: boolean) => {
  return isDark
    ? 'w-full px-4 py-3 text-sm font-mono bg-black/50 backdrop-blur-md border border-white/20 text-green-400 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder-white/20'
    : 'w-full px-4 py-3 text-sm font-mono bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all placeholder-gray-500';
};

export const getHeaderStyle = (isDark: boolean) => {
    return `flex justify-between items-end mb-8 pb-2 ${isDark ? 'border-b border-white/20' : 'border-b-4 border-black'}`;
}
