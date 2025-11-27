import { useTheme } from "@/hooks/theme";

export default function TextureOverlay() {
    const { isDarkMode } = useTheme();
    return (
      <div 
        className={`fixed top-0 left-0 w-full h-full pointer-events-none z-50 transition-opacity duration-300 ${isDarkMode ? 'opacity-10 mix-blend-overlay' : 'opacity-20 mix-blend-multiply'}`}
        style={{
          backgroundImage: `
            linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
            linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))
          `,
          backgroundSize: '100% 4px, 6px 100%'
        }}
      />
    );
  };