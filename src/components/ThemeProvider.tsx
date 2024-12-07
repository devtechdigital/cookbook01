import React, { createContext, useContext, useEffect } from 'react';
import type { CookbookSettings } from '../types/cookbook';

interface ThemeContextType {
  theme: CookbookSettings['theme'];
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'warm' });

export function useTheme() {
  return useContext(ThemeContext);
}

const themeStyles = {
  warm: 'bg-amber-50 text-amber-900',
  cool: 'bg-blue-50 text-blue-900',
  neutral: 'bg-gray-50 text-gray-900',
};

interface ThemeProviderProps {
  theme: CookbookSettings['theme'];
  children: React.ReactNode;
}

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  useEffect(() => {
    document.body.className = themeStyles[theme];
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}