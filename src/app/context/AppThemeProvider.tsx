// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

type ThemeName = 'green' | 'aqua' | 'purple' | 'blue';
type ThemeMode = 'light' | 'dark';

interface Theme {
  name: ThemeName;
  mode: ThemeMode;
}

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const themes: Theme[] = [
  { name: 'green', mode: 'light' },
  { name: 'green', mode: 'dark' },
  // { name: 'aqua', mode: 'light' },
  // { name: 'aqua', mode: 'dark' },
  // { name: 'purple', mode: 'light' },
  // { name: 'purple', mode: 'dark' },
  // { name: 'blue', mode: 'light' },
  // { name: 'blue', mode: 'dark' },
];

export const AppThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>({ name: 'blue', mode: 'light' });

  useEffect(() => {
    document.documentElement.classList.remove(...themes.map(t => `theme-${t.name}-${t.mode}`));
    document.documentElement.classList.add(`theme-${theme.name}-${theme.mode}`);
  }, [theme]);

  const contextValue: ThemeContextProps = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within an AppThemeProvider");
  }
  return context;
};