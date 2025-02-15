"use client"

import React, { useState, useEffect } from 'react';
import PlateCalculator from '@/components/PlateCalculator';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handler);
    return () => darkModeMediaQuery.removeEventListener('change', handler);
  }, []);

  return (
    <main className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <PlateCalculator isDarkMode={isDarkMode} /> {/* Pass isDarkMode prop */}
      <Analytics />
    </main>
  );
}