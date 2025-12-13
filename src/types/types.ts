export interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
  }


export interface Project {
    title: string;
    tagline: string;
    description: string;
    tags: string[];
    liveLink?: string;
    repoLink?: string;
  }

export interface Blog {
    title: string;
    tagline: string;
    description: string;
    tags: string[];
    date?: string;
    readLink?: string;
    slug?: string;
  }

