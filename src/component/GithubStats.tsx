import { useTheme } from "@/hooks/theme";

export default function GitHubStats() {
    const { isDarkMode } = useTheme();
    
    // Dynamic colors for GitHub Readme Stats
    const statsThemeQuery = isDarkMode
      ? '&title_color=4ade80&icon_color=4ade80&text_color=e4e4e7&bg_color=18181b&border_color=f4f4f5'
      : '&title_color=1a1a1a&icon_color=c92a2a&text_color=1a1a1a&bg_color=ffffff';
  
    const chartColor = isDarkMode ? '4ade80' : '196127';
  
    return (
      <>
        {/* Contribution Graph */}
        <section className={`p-8 border-b-2 transition-colors ${
          isDarkMode ? 'bg-zinc-800 border-zinc-100' : 'bg-[#f8f6f1] border-zinc-900'
        }`}>
          <div className="flex justify-between items-baseline mb-6">
            <h3 className={`font-pixel text-xl md:text-2xl ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              GitHub Contributions
            </h3>
            <span className={`font-mono text-xs uppercase px-2 py-1 ${
              isDarkMode ? 'text-zinc-900 bg-green-400' : 'text-zinc-500 bg-zinc-200'
            }`}>
              Last Year
            </span>
          </div>
          
          <div className={`w-full overflow-hidden border-2 p-2 shadow-[4px_4px_0px_0px_#ccc] ${
            isDarkMode ? 'bg-zinc-900 border-zinc-100 shadow-[#555]' : 'bg-white border-zinc-900'
          }`}>
            <div className="flex flex-col md:block gap-4">
              <div className="flex justify-end md:justify-start">
                <img 
                  src={`https://ghchart.rshah.org/${chartColor}/shubhdevelop`} 
                  alt="Shubham's GitHub Contribution Graph" 
                  className={`h-auto min-w-[600px] md:w-full ${isDarkMode ? 'filter hue-rotate-360 contrast-100' : 'filter contrast-125'}`}
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
              <div className="flex justify-end md:justify-start">
                <img 
                  src={`https://ghchart.rshah.org/${chartColor}/shubham-complyance`} 
                  alt="Shubham's GitHub Contribution Graph" 
                  className={`h-auto min-w-[600px] md:w-full ${isDarkMode ? 'filter hue-rotate-360 contrast-100' : 'filter contrast-125'}`}
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            </div>
          </div>
        </section>
  
        {/* Analytics Cards */}
        <section className={`p-8 border-b-2 relative overflow-hidden transition-colors ${
          isDarkMode ? 'bg-zinc-900/50 border-zinc-100' : 'bg-zinc-900/5 border-zinc-900'
        }`}>
          {/* Retro Grid Background */}
          <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'opacity-20' : 'opacity-10'}`} style={{ 
            backgroundImage: `linear-gradient(${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#fff' : '#000'} 1px, transparent 1px)`, 
            backgroundSize: '20px 20px' 
          }}></div>
          
          <div className="relative z-10">
            <div className={`flex justify-between items-baseline mb-8 border-b-2 pb-2 ${isDarkMode ? 'border-zinc-100' : 'border-zinc-900'}`}>
              <h3 className={`font-pixel text-xl md:text-2xl ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Stats &amp; Data
              </h3>
              <span className={`font-pixel text-[8px] uppercase border-2 px-2 py-1 animate-pulse ${
                isDarkMode 
                  ? 'text-zinc-900 bg-green-400 border-zinc-100' 
                  : 'text-zinc-900 bg-green-200 border-zinc-900'
              }`}>
                Live
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`border-2 p-1 transition-all hover:translate-x-1 hover:translate-y-1 ${
                isDarkMode 
                  ? 'bg-zinc-900 border-zinc-100 shadow-[8px_8px_0px_0px_#fff] hover:shadow-[4px_4px_0px_0px_#fff]' 
                  : 'bg-white border-zinc-900 shadow-[8px_8px_0px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_0px_#1a1a1a]'
              }`}>
                <img 
                  src={`https://github-readme-stats.vercel.app/api?username=shubhdevelop&show_icons=true&hide_border=true&hide_rank=true${statsThemeQuery}`} 
                  alt="GitHub Stats" 
                  className="w-full"
                />
              </div>
              <div className={`border-2 p-1 transition-all hover:translate-x-1 hover:translate-y-1 ${
                isDarkMode 
                  ? 'bg-zinc-900 border-zinc-100 shadow-[8px_8px_0px_0px_#fff] hover:shadow-[4px_4px_0px_0px_#fff]' 
                  : 'bg-white border-zinc-900 shadow-[8px_8px_0px_0px_#1a1a1a] hover:shadow-[4px_4px_0px_0px_#1a1a1a]'
              }`}>
                <img 
                  src={`https://github-readme-stats.vercel.app/api/top-langs/?username=shubhdevelop&layout=compact&hide_border=true${statsThemeQuery}`} 
                  alt="Top Languages" 
                  className="w-full"
                />
              </div>
            </div>
            <div className="text-center mt-6">
              <a href="https://github.com/shubhdevelop" target="_blank" rel="noopener noreferrer" className={`font-pixel text-[8px] uppercase tracking-widest hover:text-red-700 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                [INSERT COIN] &bull; Source: GitHub API &bull; User: @shubhdevelop
              </a>
            </div>
          </div>
        </section>
      </>
    );
  };