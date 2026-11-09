import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AppTheme } from '@device-analyzer/shared';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>('dark');

  useEffect(() => {
    // Read initial theme from Electron SQLite settings
    if (window.deviceAnalyzer?.getTheme) {
      window.deviceAnalyzer.getTheme().then(saved => {
        if (saved) {
          applyTheme(saved);
        }
      }).catch(() => {
        applyTheme('dark');
      });
    } else {
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    const root = document.documentElement;

    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: AppTheme) => {
    applyTheme(newTheme);
    if (window.deviceAnalyzer?.setTheme) {
      window.deviceAnalyzer.setTheme(newTheme).catch(console.error);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

