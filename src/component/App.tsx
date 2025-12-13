"use client";

import { useTheme } from "@/hooks/theme";
import Sidebar from "./Sidebar";
import FeaturedWorks from "./FeaturedWorks";
import Blogs from "./Blogs";
import Footer from "./Footer";
import GitHubStats from "./GithubStats";
import Hero from "./Hero";
import Masthead from "./Masthead";
import MetaBar from "./Metabar";
import TextureOverlay from "./TextureOverlay";

export default function App() {
    const { isDarkMode } = useTheme();
  
    return (
        <div className={`antialiased p-0 md:p-8 min-h-screen font-sans transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-[#111] text-zinc-100 selection:bg-green-400 selection:text-zinc-900' 
            : 'bg-[#eae8dc] text-zinc-900 selection:bg-red-700 selection:text-white'
        }`} style={{
          backgroundImage: `radial-gradient(${isDarkMode ? '#333' : '#a1a1aa'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}>
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
          `}</style>
          
          <style>{`
            .font-pixel { font-family: 'Press Start 2P', cursive; }
            .font-mono { font-family: 'JetBrains Mono', monospace; }
            .pixelated { image-rendering: pixelated; }
          `}</style>
  
          <TextureOverlay />
  
          <div className={`max-w-[1200px] mx-auto shadow-[0_0_0_4px_#1a1a1a] min-h-screen relative border-2 transition-colors ${
            isDarkMode ? 'bg-zinc-900 border-zinc-100 shadow-[0_0_0_4px_#f4f4f5]' : 'bg-[#fdfbf7] border-zinc-900'
          }`}>
            <MetaBar />
            <Masthead />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
              <main className={`lg:col-span-8 border-r-0 lg:border-r-2 ${isDarkMode ? 'border-zinc-100' : 'border-zinc-900'}`}>
                <Hero />
                <FeaturedWorks />
                <Blogs />
                <GitHubStats />
              </main>
              <Sidebar />
            </div>
            
            <Footer />
          </div>
        </div>
    );
  }