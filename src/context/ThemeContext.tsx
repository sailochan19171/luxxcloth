import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme } from '../types';

const themes: Theme[] = [
  {
    name: 'Classic',
    colors: {
      primary: 'amber-600',
      secondary: 'gray-900',
      accent: 'stone-100'
    },
    primary: 'amber-600',
    secondary: 'gray-900',
    accent: 'stone-100',
    background: 'white',
    text: 'gray-900',
    surface: 'white',
    backgroundColor: 'white',
    texture: 'smooth',
    lighting: 'natural',
    environment: 'studio',
    ambientEffects: ['soft-shadows', 'warm-glow']
  },
  {
    name: 'Midnight',
    colors: {
      primary: 'blue-600',
      secondary: 'slate-900',
      accent: 'slate-100'
    },
    primary: 'blue-600',
    secondary: 'slate-900',
    accent: 'slate-100',
    background: 'slate-50',
    text: 'slate-900',
    surface: 'white',
    backgroundColor: 'slate-50',
    texture: 'matte',
    lighting: 'cool',
    environment: 'modern',
    ambientEffects: ['cool-shadows', 'blue-tint']
  },
  {
    name: 'Rose Gold',
    colors: {
      primary: 'rose-500',
      secondary: 'gray-800',
      accent: 'rose-50'
    },
    primary: 'rose-500',
    secondary: 'gray-800',
    accent: 'rose-50',
    background: 'rose-25',
    text: 'gray-800',
    surface: 'white',
    backgroundColor: 'rose-25',
    texture: 'metallic',
    lighting: 'warm',
    environment: 'elegant',
    ambientEffects: ['rose-glow', 'metallic-shine']
  },
  {
    name: 'Emerald',
    colors: {
      primary: 'emerald-600',
      secondary: 'gray-900',
      accent: 'emerald-50'
    },
    primary: 'emerald-600',
    secondary: 'gray-900',
    accent: 'emerald-50',
    background: 'emerald-25',
    text: 'gray-900',
    surface: 'white',
    backgroundColor: 'emerald-25',
    texture: 'natural',
    lighting: 'bright',
    environment: 'fresh',
    ambientEffects: ['green-glow', 'natural-shadows']
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(themes[0]);

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    // Update CSS custom properties
    document.documentElement.style.setProperty('--primary-color', theme.primary || '');
    document.documentElement.style.setProperty('--secondary-color', theme.secondary || '');
    document.documentElement.style.setProperty('--accent-color', theme.accent || '');
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
