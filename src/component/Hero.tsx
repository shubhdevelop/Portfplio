import { useTheme } from "@/hooks/theme";
import Image from "next/image";

export default function Hero() {
    const { isDarkMode } = useTheme();
    return (
      <section className={`p-8 md:p-12 border-b-2 relative transition-colors ${
        isDarkMode 
          ? 'bg-zinc-900 border-zinc-100' 
          : 'bg-[#fdfbf7] border-zinc-900'
      }`}>
        {/* Decorative pixel corners */}
        <div className={`absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 ${isDarkMode ? 'border-zinc-100' : 'border-zinc-900'}`}></div>
        <div className={`absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 ${isDarkMode ? 'border-zinc-100' : 'border-zinc-900'}`}></div>
        <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 ${isDarkMode ? 'border-zinc-100' : 'border-zinc-900'}`}></div>
        <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 ${isDarkMode ? 'border-zinc-100' : 'border-zinc-900'}`}></div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="order-2 md:order-1">
            <div className={`inline-block px-2 py-1 font-pixel text-[10px] mb-4 ${
              isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
            }`}>
              NEW CHALLENGER APPROACHING
            </div>
            <h2 className={`font-pixel text-2xl md:text-3xl leading-snug mb-6 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              SYSTEMS <br/>
              <span className={isDarkMode ? 'text-green-400' : 'text-red-700'}>ENTHUSIAST</span>
            </h2>
            <div className={`font-mono text-sm leading-relaxed mb-8 text-justify border-l-4 pl-4 ${
              isDarkMode ? 'text-zinc-300 border-zinc-700' : 'text-zinc-700 border-zinc-300'
            }`}>
              I love figuring out how things work. All things backend and systems programming CPU, memory, Networking and everything in between.
              projects: yapl (lang) | ykvs (db) | gb emulator (hardware) TS for money 💰| Go & C for fun | football | Code
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 font-pixel text-[10px] md:text-xs">
              <a 
                href="https://github.com/shubhdevelop" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`px-6 py-4 uppercase tracking-widest transition-all text-center active:translate-y-1 active:shadow-none border-2 ${
                  isDarkMode
                    ? 'bg-green-600 text-zinc-900 border-green-400 hover:bg-green-500 shadow-[4px_4px_0px_0px_#fff]'
                    : 'bg-red-600 text-white border-black hover:bg-red-700 shadow-[4px_4px_0px_0px_#000]'
                }`}
              >
                Access GitHub
              </a>
              <a 
                href="https://twitter.com/_Shubham2XX" 
                target="_blank"
                rel="noopener noreferrer"
                className={`border-2 px-6 py-4 uppercase tracking-widest transition-all text-center active:translate-y-1 active:shadow-none ${
                  isDarkMode
                    ? 'bg-zinc-900 text-zinc-100 border-zinc-100 hover:bg-zinc-800 shadow-[4px_4px_0px_0px_#fff]'
                    : 'bg-white text-zinc-900 border-zinc-900 hover:bg-zinc-100 shadow-[4px_4px_0px_0px_#000]'
                }`}
              >
                Follow on X
              </a>
            </div>
          </div>
  
          <div className="order-1 md:order-2 flex flex-col items-center">
            <figure className="relative w-full group">
              <div className={`border-4 p-2 transition-all duration-300 group-hover:translate-x-1 group-hover:translate-y-1 ${
                isDarkMode
                  ? 'border-zinc-100 bg-zinc-800 shadow-[8px_8px_0px_0px_#fff] group-hover:shadow-[4px_4px_0px_0px_#22c55e]'
                  : 'border-zinc-900 bg-white shadow-[8px_8px_0px_0px_#1a1a1a] group-hover:shadow-[4px_4px_0px_0px_#c92a2a]'
              }`}>
                <Image
                  src="/pp.jpg" 
                  width={500}
                  height={500}
                  alt="Shubham Raj Profile" 
                  className={`w-full h-auto pixelated ${isDarkMode ? 'filter  hue-rotate-90' : 'filter grayscale contrast-125'}`}
                  style={{ imageRendering: 'pixelated' }} 
                />
              </div>
              <figcaption className={`font-pixel text-[8px] mt-4 uppercase tracking-widest text-center w-full py-1 border ${
                isDarkMode ? 'bg-zinc-800 text-zinc-400 border-zinc-600' : 'bg-zinc-100 text-zinc-500 border-zinc-300'
              }`}>
                Player Select: Shubham
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    );
  };