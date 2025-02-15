"use client"

import React, { useState, useEffect } from 'react';
import PlateCalculator from '@/components/PlateCalculator';
import { Analytics } from '@vercel/analytics/react';
import { FaGithub } from 'react-icons/fa'

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
    <main className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <PlateCalculator isDarkMode={isDarkMode} /> {/* Pass isDarkMode prop */}
      <Analytics />
      <footer className="flex gap-2 items-center justify-center text-center text-gray-500 text-sm mt-4">
        <p>&copy; {new Date().getFullYear()} Rachel Sheppard. All rights reserved.</p>
        <a 
          href="https://github.com/rsheppard1/barloader" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <FaGithub size={18} />
        </a>
      </footer>
    </main>
  );
}