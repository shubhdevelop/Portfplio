// --- Context & Types ---

import { ThemeContextType } from "@/types/types";
import { createContext, useContext } from "react";


  
  export const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleTheme: () => {},
  });
  
  export const useTheme = () => useContext(ThemeContext);