import { useState, useEffect, useCallback } from 'react';

const THEME_STORAGE_KEY = 'bookfinder_theme';
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const useTheme = () => {
  const [theme, setTheme] = useState(THEMES.DARK);
  const getSystemTheme = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? THEMES.DARK 
        : THEMES.LIGHT;
    }
    return THEMES.DARK; 
  }, []);

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme && Object.values(THEMES).includes(storedTheme)) {
        setTheme(storedTheme);
      } else {
        const systemTheme = getSystemTheme();
        setTheme(systemTheme);
      }
    } catch (error) {
      console.error('Error loading theme from localStorage:', error);
      setTheme(THEMES.DARK);
    }
  }, [getSystemTheme]);

  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    root.setAttribute('data-theme', theme);
    root.classList.add(theme);
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const themeColors = {
        [THEMES.LIGHT]: '#f9fafb',
        [THEMES.DARK]: '#0d1117'
      };
      metaThemeColor.setAttribute('content', themeColors[theme]);
    }
    
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => 
      prevTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    );
  }, []);

  const setLightTheme = useCallback(() => {
    setTheme(THEMES.LIGHT);
  }, []);

  const setDarkTheme = useCallback(() => {
    setTheme(THEMES.DARK);
  }, []);

  const resetToSystemTheme = useCallback(() => {
    const systemTheme = getSystemTheme();
    setTheme(systemTheme);
  }, [getSystemTheme]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!storedTheme) {
        setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  return {
    theme,
    isDark: theme === THEMES.DARK,
    isLight: theme === THEMES.LIGHT,
    
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    resetToSystemTheme,
    
    themes: THEMES
  };
};