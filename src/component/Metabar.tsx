import { useTheme } from "@/hooks/theme";
import { Gamepad2, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export default function MetaBar() {
    const [date, setDate] = useState('');
    const { isDarkMode, toggleTheme } = useTheme();
  
    useEffect(() => {
      const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      setDate(new Date().toLocaleDateString('en-US', options).toUpperCase());
    }, []);
  
    return (
      <div className={`border-b-4 flex justify-between items-center px-4 py-2 text-[10px] md:text-xs font-pixel uppercase tracking-widest transition-colors ${
        isDarkMode 
          ? 'bg-zinc-900 border-zinc-100 text-zinc-100' 
          : 'bg-[#fdfbf7] border-zinc-900 text-zinc-800'
      }`}>
        <span className="hidden md:flex items-center gap-2">
          <Gamepad2 className="w-4 h-4" /> 
          Vol. 01
        </span>
        
        <span className={`font-bold animate-pulse ${isDarkMode ? 'text-green-400' : 'text-red-700'}`}>
          {isDarkMode ? 'INSERT COIN' : 'PRESS START'}
        </span>
  
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">{date}</span>
          <button 
            onClick={toggleTheme}
            className={`p-1 border-2 hover:scale-105 active:scale-95 transition-all ${
              isDarkMode 
                ? 'border-zinc-100 text-yellow-400 hover:bg-zinc-800' 
                : 'border-zinc-900 text-zinc-900 hover:bg-zinc-200'
            }`}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    );
  };