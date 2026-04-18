import React, { createContext, useContext } from 'react';
import '../styles/tokens.css';

interface ThemeContextType {
  theme: 'dark'; // Tactical HUD is always dark
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const RangeOSThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ theme: 'dark' }}>
      <div className="rangeos-theme-container min-h-screen bg-[#020617] text-white selection:bg-sky-500/30">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useRangeOSTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useRangeOSTheme must be used within a RangeOSThemeProvider');
  }
  return context;
};
