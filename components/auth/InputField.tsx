'use client';

import { forwardRef } from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
            error ? 'border-red-500 dark:border-red-400' : ''
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 transition-colors duration-300">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;