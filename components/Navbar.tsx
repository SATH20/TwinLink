'use client';

import { Moon, Sparkles, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { Show, UserButton } from '@clerk/nextjs';

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const activeTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = (activeTheme ?? 'dark') === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
            <span className="text-2xl font-bold cobalt-gradient-text">TwinLink</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium">
              How It Works
            </a>
            <a href="#about" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium">
              About
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <Show when="signed-out">
              <Link href="/sign-in">
                <button className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium">
                  Sign In
                </button>
              </Link>

              <Link href="/sign-up">
                <button className="px-6 py-2 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
                  Get Started
                </button>
              </Link>
            </Show>

            <Show when="signed-in">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10"
                  }
                }}
              />
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
}
