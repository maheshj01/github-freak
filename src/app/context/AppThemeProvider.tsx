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
  toggleDarkMode: () => void;
}

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const themes: Theme[] = [
  { name: 'green', mode: 'light' },
  { name: 'aqua', mode: 'light' },
  { name: 'purple', mode: 'light' },
  { name: 'blue', mode: 'light' },
];

export function AppThemeProvider({
  children,
  defaultTheme = { name: 'blue', mode: 'light' },
  storageKey = "react-ui-theme"
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(storageKey);
    return storedTheme ? JSON.parse(storedTheme) : defaultTheme;
  });

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(...themes.map(t => `theme-${t.name}-${t.mode}`));
    html.classList.add(`theme-${theme.name}-${theme.mode}`);

    localStorage.setItem(storageKey, JSON.stringify(theme));
  }, [theme, storageKey]);

  const toggleDarkMode = () => {
    setTheme(prevTheme => ({
      ...prevTheme,
      mode: prevTheme.mode === 'light' ? 'dark' : 'light'
    }));
  };

  const contextValue: ThemeContextProps = {
    theme,
    setTheme,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within an AppThemeProvider");
  }
  return context;
};
