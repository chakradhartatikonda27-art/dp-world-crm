'use client';

import React, { createContext, useContext, useEffect } from 'react';

export type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    try {
      localStorage.setItem('logios_theme', 'light');
      document.documentElement.classList.remove('dark');
    } catch (e) {}
  }, []);

  const setTheme = () => {
    try {
      localStorage.setItem('logios_theme', 'light');
    } catch (e) {}
    document.documentElement.classList.remove('dark');
  };

  const toggleTheme = () => {
    setTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme, setTheme }}>
      <div className="theme-light bg-white text-slate-900 min-h-screen w-full">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
