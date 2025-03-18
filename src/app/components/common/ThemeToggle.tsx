"use client";

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we can access the theme from the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // While not mounted, show an empty space to prevent layout shift
  if (!mounted) {
    return <div className={`h-6 w-6 ${className}`} />;
  }

  return (
    <button
      aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
      type="button"
      className={`rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </button>
  );
}