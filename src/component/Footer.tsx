import { useTheme } from "@/hooks/theme";
import { Zap } from "lucide-react";


export default function Footer() {
    const { isDarkMode } = useTheme();
    return (
      <footer className={`border-t-4 py-12 text-center border-b-8 ${
        isDarkMode 
          ? 'bg-zinc-900 border-zinc-100 border-b-green-400' 
          : 'bg-[#fdfbf7] border-zinc-900 border-b-red-700'
      }`}>
        <h2 className={`font-pixel text-2xl md:text-3xl mb-6 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
          GAME OVER
        </h2>
        <div className={`flex justify-center gap-8 mb-8 font-pixel text-[10px] uppercase tracking-widest ${
          isDarkMode ? 'text-zinc-300' : 'text-zinc-900'
        }`}>
          <a href="https://www.linkedin.com/in/shubhamraj10" target="_blank" rel="noopener noreferrer" className="hover:text-red-700 hover:underline decoration-wavy">LinkedIn</a>
          <a href="https://twitter.com/_Shubham2XX" target="_blank" rel="noopener noreferrer" className="hover:text-red-700 hover:underline decoration-wavy">Twitter</a>
          <a href="https://instagram.com/nemessisx_" target="_blank" rel="noopener noreferrer" className="hover:text-red-700 hover:underline decoration-wavy">Instagram</a>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
          Engineered with <Zap className="w-3 h-3 inline text-yellow-500 fill-current" /> by Shubham
        </p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mt-2">
          &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </footer>
    );
  };
  