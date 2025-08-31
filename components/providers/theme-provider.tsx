'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/stores/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setResolvedTheme } = useThemeStore();

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
        root.classList.toggle('dark', systemTheme === 'dark');
        setResolvedTheme(systemTheme);
      } else {
        root.classList.toggle('dark', theme === 'dark');
        setResolvedTheme(theme as 'light' | 'dark');
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', applyTheme);

    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme, setResolvedTheme]);

  return <>{children}</>;
}