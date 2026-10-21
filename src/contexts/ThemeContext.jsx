import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('vitaplay-theme');
    return saved || 'forest';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme attributes
    root.removeAttribute('data-theme');
    
    // Apply new theme
    if (theme === 'ocean') {
      root.setAttribute('data-theme', 'ocean');
    } else if (theme === 'sunrise') {
      root.setAttribute('data-theme', 'sunrise');
    }
    // forest is default, no attribute needed
    
    localStorage.setItem('vitaplay-theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme(current => {
      if (current === 'forest') return 'ocean';
      if (current === 'ocean') return 'sunrise';
      return 'forest';
    });
  };

  const value = {
    theme,
    setTheme,
    cycleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};