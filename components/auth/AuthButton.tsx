'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'google';
  loading?: boolean;
}

export default function AuthButton({ 
  children, 
  variant = 'primary', 
  loading = false, 
  className = '', 
  disabled,
  ...props 
}: AuthButtonProps) {
  const baseClasses = "w-full rounded-lg py-3 px-4 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl hover:scale-[1.02]",
    secondary: "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 focus:ring-slate-500 border border-slate-300 dark:border-slate-600",
    google: "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 focus:ring-slate-500 shadow-sm hover:shadow-md"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}