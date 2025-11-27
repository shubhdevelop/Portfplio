import { useTheme } from "@/hooks/theme";
import { Project } from "@/types/types";
import ProjectCard from "./ProjectCard";

export default function FeaturedWorks() {
    const { isDarkMode } = useTheme();
    const projects: Project[] = [
      {
        title: "emuGBC",
        tagline: "Gameboy Color Emulator",
        description: "A Game Boy DMG(dot matrix graphic) and Game Boy Color emulator, which uses Sharp SM83 inside, with 501 instructions set emulated written in Go and Ebiten Magic (WIP). Pixel processing unit, memory management unit and Timer and display included.",
        tags: ["Go", "Ebiten", "Emulator"],
        repoLink: "https://github.com/shubhdevelop/emuGBC"
      },
      {
        title: "YAKVS",
        tagline: "Yet Another Key Value Store",
        description: "A custom-built key-value storage system implemented in Go, exploring fundamental database concepts and efficient data structures.",
        tags: ["Go", "Database", "Systems"],
        repoLink: "https://github.com/shubhdevelop/YAKVS"
      },
      {
        title: "YAPL",
        tagline: "Yet Another Programming Language",
        description: "A custom-built interpreter implemented in Go, exploring the fundamentals of interpreters and compilers.",
        tags: ["Go", "Interpreter", "Lang"],
        repoLink: "https://github.com/shubhdevelop/YAPL"
      },
      {
        title: "infiniteDraw",
        tagline: "Infinite Canvas Drawing",
        description: "An interactive drawing tool with unlimited canvas space. A personal project planned to be open source and managed long term.",
        tags: ["TypeScript", "Canvas", "Web"],
        repoLink: "https://github.com/shubhdevelop/infiniteDraw"
      }
    ];
  
    return (
      <section className={`border-b-2 transition-colors ${
        isDarkMode ? 'bg-zinc-900 border-zinc-100' : 'bg-[#fdfbf7] border-zinc-900'
      }`}>
        <div className={`border-b-2 p-4 md:p-6 flex justify-between items-center sticky top-0 z-10 ${
          isDarkMode ? 'border-zinc-100 bg-zinc-800 text-zinc-100' : 'border-zinc-900 bg-zinc-900 text-white'
        }`}>
          <h3 className={`font-pixel text-sm md:text-lg tracking-wide ${isDarkMode ? 'text-green-400' : 'text-yellow-400'}`}>
            Headline Projects
          </h3>
          <a 
            href="https://github.com/shubhdevelop?tab=repositories" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`font-pixel text-[8px] md:text-[10px] uppercase transition-colors border px-2 py-1 ${
              isDarkMode 
                ? 'border-zinc-100 hover:bg-zinc-100 hover:text-zinc-900' 
                : 'border-white hover:bg-white hover:text-zinc-900'
            }`}
          >
            View All ↗
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2">
          {projects.map((project, idx) => (
            <ProjectCard 
              key={project.title} 
              project={project} 
              isFirst={idx === 0}
              isLastRow={idx >= 2} 
            />
          ))}
        </div>
      </section>
    );
  };
  