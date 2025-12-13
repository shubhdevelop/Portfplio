import { useTheme } from "@/hooks/theme";
import { ArrowUpRight } from "lucide-react";
import TechIcon from "./TechIcon";

export default function Sidebar() {
    const { isDarkMode } = useTheme();
    return (
      <aside className={`lg:col-span-4 border-l-0 lg:border-l-2 transition-colors ${
        isDarkMode 
          ? 'bg-zinc-900 border-zinc-100' 
          : 'bg-[#fdfbf7] border-zinc-900'
      }`}>
        
        {/* Now Building */}
        <div className={`p-8 border-b-2 ${isDarkMode ? 'border-zinc-100' : 'border-zinc-900'}`}>
          <h5 className={`font-pixel text-[10px] uppercase tracking-widest mb-6 border-b pb-2 ${
            isDarkMode ? 'text-zinc-400 border-zinc-700' : 'text-zinc-400 border-zinc-900'
          }`}>
            Current Quest
          </h5>
          
          <div className={`border-2 p-6 shadow-[6px_6px_0px_0px_#1a1a1a] relative hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 cursor-pointer group ${
            isDarkMode ? 'bg-zinc-800 border-zinc-100 shadow-[6px_6px_0px_0px_#fff]' : 'bg-white border-zinc-900'
          }`}>
            <div className="absolute top-0 right-0 bg-zinc-900 text-white p-1 group-hover:bg-red-600 transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-700 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-700"></span>
              </span>
              <span className="font-pixel text-[8px] font-bold uppercase tracking-widest text-red-700">Loading...</span>
            </div>
            <h4 className={`font-pixel text-lg mb-2 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
              emuGBC
            </h4>
            <p className={`text-xs font-mono mb-6 border-l-4 border-red-700 pl-3 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Game Boy Color emulator with SM83 CPU emulation. WIP.
            </p>
            
            {/* HP Bar Style Progress */}
            <div className={`w-full h-4 mb-2 border-2 overflow-hidden ${
              isDarkMode ? 'bg-zinc-700 border-zinc-100' : 'bg-zinc-300 border-zinc-900'
            }`}>
              <div className="bg-green-600 h-full" style={{ width: '45%' }}>
                 <div className="w-full h-1/2 bg-white/20"></div>
              </div>
            </div>
            <div className={`flex justify-between font-pixel text-[8px] ${isDarkMode ? 'text-zinc-300' : 'text-zinc-900'}`}>
              <span>HP: 45/100</span>
              <span className="font-bold">LVL 4</span>
            </div>
          </div>
        </div>
  
        {/* Toolbox */}
        <div className={`p-8 border-b-2 ${isDarkMode ? 'border-zinc-100' : 'border-zinc-900'}`}>
          <h3 className={`font-pixel text-xl mb-6 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
            Inventory
          </h3>
          <div className={`space-y-3 font-mono text-sm uppercase tracking-wide ${isDarkMode ? 'text-zinc-300' : 'text-zinc-900'}`}>
            
            {[
              { name: "JavaScript", level: "95" },
              { name: "TypeScript", level: "90" },
              { name: "Go", level: "85" },
              { name: "C", level: "80" },
              { name: "React", level: "95" },
              { name: "Next.js", level: "90" },
              { name: "Node.js", level: "85" },
              { name: "MongoDB", level: "80" }
            ].map(tool => (
              <div key={tool.name} className="flex items-center justify-between group">
                <div className="flex items-center">
                  <div className={`w-4 h-4 mr-2 transition-colors ${
                    isDarkMode ? 'bg-zinc-100 group-hover:bg-green-400' : 'bg-zinc-900 group-hover:bg-red-600'
                  }`}></div>
                  <span className={`font-bold transition-colors ${
                    isDarkMode ? 'group-hover:text-green-400' : 'group-hover:text-red-700'
                  }`}>{tool.name}</span>
                </div>
                
                <div className="flex-grow border-b-2 border-dotted border-gray-400 mx-2 relative top-1"></div>
                
                {/* Replaced Text Level with Icon */}
                <div className={`transition-transform duration-300 hover:scale-125 ${
                  isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                  <TechIcon name={tool.name} className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Experience & Education */}
        <div className={`p-8 border-b-2 lg:border-b-0 ${isDarkMode ? 'bg-zinc-800 border-zinc-100' : 'bg-white border-zinc-900'}`}>
          <h3 className={`font-pixel text-xl mb-8 border-b-4 inline-block pb-1 ${
            isDarkMode ? 'text-zinc-100 border-zinc-100' : 'text-zinc-900 border-zinc-900'
          }`}>
            Adventure Log
          </h3>
          
          <div className={`space-y-8 border-l-4 pl-6 ml-2 ${isDarkMode ? 'border-zinc-600' : 'border-zinc-200'}`}>
            {/* Job 1 - Complyance Full-Stack Developer */}
            <div className="relative group">
              <div className={`absolute -left-[35px] top-1 w-6 h-6 border-4 shadow-[2px_2px_0px_0px_#ccc] transition-colors ${
                isDarkMode 
                  ? 'bg-zinc-100 border-zinc-800 group-hover:bg-green-400' 
                  : 'bg-zinc-900 border-white group-hover:bg-red-600'
              }`}></div>
              <div className="flex flex-col mb-1">
                <h4 className={`font-bold text-lg font-pixel ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  Complyance
                </h4>
                <span className={`font-mono text-[10px] inline-block w-max px-2 py-0.5 my-1 ${
                  isDarkMode ? 'text-zinc-900 bg-zinc-100' : 'text-white bg-zinc-900'
                }`}>
                  Jun 2025 - Present
                </span>
              </div>
              <p className="font-mono text-xs mb-2 text-red-700 font-bold uppercase">Full-Stack Developer</p>
              <p className={`font-sans text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Leading end-to-end product development in microservices architecture with Encore and Next.js. Engineered A3-compliant PDF/XLSX report generation producing 2,000+ reports daily. Built configurable multi-country forms with TanStack Form for e-invoicing standards across Malaysia, Saudi Arabia, and UAE.
              </p>
            </div>
  
            {/* Job 2 - Complyance Intern */}
            <div className="relative group">
              <div className={`absolute -left-[35px] top-1 w-6 h-6 border-4 transition-colors ${
                isDarkMode
                  ? 'bg-zinc-800 border-zinc-100 group-hover:border-green-400'
                  : 'bg-white border-zinc-900 group-hover:border-red-600'
              }`}></div>
              <div className="flex flex-col mb-1">
                <h4 className={`font-bold text-lg font-pixel ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  Complyance
                </h4>
                <span className={`font-mono text-[10px] border inline-block w-max px-2 py-0.5 my-1 ${
                  isDarkMode ? 'text-zinc-400 border-zinc-400' : 'text-zinc-600 border-zinc-900'
                }`}>
                  Oct 2024 - Jun 2025
                </span>
              </div>
              <p className="font-mono text-xs mb-2 text-red-700 font-bold uppercase">Full-Stack Developer Intern</p>
              <p className={`font-sans text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Contributed to Phase 2 expansion of e-invoicing platform in Malaysia. Developed custom data views, localized report generation, and multi-step onboarding experience for seamless client integration.
              </p>
            </div>

            {/* Job 3 - Real Dev Squad */}
            <div className="relative group">
              <div className={`absolute -left-[35px] top-1 w-6 h-6 border-4 transition-colors ${
                isDarkMode
                  ? 'bg-zinc-800 border-zinc-100 group-hover:border-green-400'
                  : 'bg-white border-zinc-900 group-hover:border-red-600'
              }`}></div>
              <div className="flex flex-col mb-1">
                <h4 className={`font-bold text-lg font-pixel ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  Real Dev Squad
                </h4>
                <span className={`font-mono text-[10px] border inline-block w-max px-2 py-0.5 my-1 ${
                  isDarkMode ? 'text-zinc-400 border-zinc-400' : 'text-zinc-600 border-zinc-900'
                }`}>
                  Jun 2024 - Jun 2025
                </span>
              </div>
              <p className="font-mono text-xs mb-2 text-red-700 font-bold uppercase">Open Source Contributor</p>
              <p className={`font-sans text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Designed and shipped features for server profiles, feature flags, and superuser privileges. Wrote design documentation, reviewed PRs, and set up Storybook for component development and testing.
              </p>
            </div>
  
            {/* Job 4 - DiceDB */}
            <div className="relative group">
              <div className={`absolute -left-[35px] top-1 w-6 h-6 border-4 transition-colors ${
                isDarkMode
                  ? 'bg-zinc-800 border-zinc-100 group-hover:border-green-400'
                  : 'bg-white border-zinc-900 group-hover:border-red-600'
              }`}></div>
              <div className="flex flex-col mb-1">
                <h4 className={`font-bold text-lg font-pixel ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                  DiceDB
                </h4>
                <span className={`font-mono text-[10px] border inline-block w-max px-2 py-0.5 my-1 ${
                  isDarkMode ? 'text-zinc-400 border-zinc-400' : 'text-zinc-600 border-zinc-900'
                }`}>
                  Oct 2024 - Nov 2024
                </span>
              </div>
              <p className="font-mono text-xs mb-2 text-red-700 font-bold uppercase">Open Source Contributor</p>
              <p className={`font-sans text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Improved developer experience by implementing persistent command history, real-time inline syntax hints, and arrow-key navigation for intuitive command traversal.
              </p>
            </div>
  
            {/* Education */}
            <div className={`relative pt-6 border-t-2 border-dashed mt-8 ${isDarkMode ? 'border-zinc-600' : 'border-zinc-300'}`}>
              <h3 className={`font-pixel text-lg mb-6 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                Tutorial Comp.
              </h3>
              
              {/* Education 1 - College */}
              <div className="relative group mb-6">
                <div className={`absolute -left-[35px] top-1 w-6 h-6 border-4 transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-800 border-zinc-100 group-hover:border-green-400'
                    : 'bg-white border-zinc-900 group-hover:border-red-600'
                }`}></div>
                <div className="flex flex-col mb-1">
                  <h4 className={`font-bold text-sm font-pixel ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Sri Guru Gobind Singh College Of Commerce
                  </h4>
                  <span className={`font-mono text-[10px] border inline-block w-max px-2 py-0.5 my-1 ${
                    isDarkMode ? 'text-zinc-400 border-zinc-400' : 'text-zinc-600 border-zinc-900'
                  }`}>
                    Nov 2022 - Nov 2026
                  </span>
                </div>
                <p className="font-mono text-xs mb-2 text-red-700 font-bold uppercase">Bachelor of Commerce (BCom)</p>
                <p className={`font-sans text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Business/Commerce, General. Activities: 180dc (Students run consulting service), Debating society. Delhi University - one of the most renowned universities in India for undergraduate courses.
                </p>
              </div>

              {/* Education 2 - High School */}
              <div className="relative group">
                <div className={`absolute -left-[35px] top-1 w-6 h-6 border-4 transition-colors ${
                  isDarkMode
                    ? 'bg-zinc-800 border-zinc-100 group-hover:border-green-400'
                    : 'bg-white border-zinc-900 group-hover:border-red-600'
                }`}></div>
                <div className="flex flex-col mb-1">
                  <h4 className={`font-bold text-sm font-pixel ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                    Kendriya Vidyalaya
                  </h4>
                  <span className={`font-mono text-[10px] border inline-block w-max px-2 py-0.5 my-1 ${
                    isDarkMode ? 'text-zinc-400 border-zinc-400' : 'text-zinc-600 border-zinc-900'
                  }`}>
                    Apr 2020 - Apr 2022
                  </span>
                </div>
                <p className="font-mono text-xs mb-2 text-red-700 font-bold uppercase">High School Diploma</p>
                <p className={`font-sans text-xs leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Business/Commerce, General. Completed +2 school education with 94.6%. Activities: Photography, Cricket, Football, Chess.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Box */}
        <div className={`p-8 text-center ${isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'}`}>
          <h3 className={`font-pixel text-lg mb-4 ${isDarkMode ? 'text-green-600' : 'text-yellow-400'}`}>
            CONTINUE?
          </h3>
          <a href="https://github.com/shubhdevelop" target="_blank" rel="noopener noreferrer" className={`inline-block border-2 px-6 py-3 font-pixel text-xs uppercase transition-colors shadow-[4px_4px_0px_0px_#888] ${
            isDarkMode
              ? 'bg-zinc-900 text-white border-zinc-900 hover:bg-green-400 hover:text-zinc-900'
              : 'bg-red-600 border-white hover:bg-white hover:text-red-600'
          }`}>
            PRESS START
          </a>
        </div>
  
      </aside>
    );
  };