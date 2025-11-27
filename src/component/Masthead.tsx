import { useTheme } from "@/hooks/theme";

export default function Masthead() {
    const { isDarkMode } = useTheme();
    return (
      <header className={`border-b-[6px] px-6 py-12 md:py-16 text-center relative overflow-hidden group transition-colors ${
        isDarkMode 
          ? 'bg-zinc-900 border-zinc-100 text-zinc-100' 
          : 'bg-[#fdfbf7] border-zinc-900 text-zinc-900'
      }`}>
        
        <div className={`inline-block border-4 px-4 py-1 mb-6 rounded-full transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer ${
          isDarkMode
            ? 'border-zinc-100 shadow-[4px_4px_0px_0px_#ffffff]'
            : 'border-zinc-900 shadow-[4px_4px_0px_0px_#1a1a1a]'
        }`}>
          <span className="font-pixel text-xs tracking-widest">PLAYER 1</span>
        </div>
        
        <h1 className={`font-pixel text-4xl md:text-6xl lg:text-7xl font-black leading-tight transform scale-y-110 mb-6 ${
          isDarkMode
            ? 'text-zinc-100 drop-shadow-[4px_4px_0px_rgba(34,197,94,0.4)]'
            : 'text-zinc-900 drop-shadow-[4px_4px_0px_rgba(201,42,42,0.4)]'
        }`}>
          SHUBHAM RAJ
        </h1>
        
        <p className={`font-mono text-sm md:text-lg max-w-2xl mx-auto border-y-2 py-4 ${
          isDarkMode ? 'text-zinc-400 border-zinc-100/20' : 'text-zinc-600 border-zinc-900/10'
        }`}>
          <span className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-red-700'}`}>🦍</span> SYSTEMS PROGRAMMING ENTHUSIAST &bull; BUILDING &bull; CHENNAI, INDIA
        </p>
        
        <div className="absolute top-6 right-6 md:top-12 md:right-12 transform rotate-[15deg] hover:rotate-0 transition-transform duration-300">
          <div className={`border-[3px] px-3 py-2 font-pixel text-[10px] uppercase tracking-widest ${
            isDarkMode
              ? 'border-green-400 bg-zinc-800 text-green-400 shadow-[4px_4px_0px_0px_#22c55e]'
              : 'border-green-700 bg-green-50 text-green-700 shadow-[4px_4px_0px_0px_#15803d]'
          }`}>
            Status: Online
          </div>
        </div>
      </header>
    );
  };
  