'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OptionCardProps {
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

export default function OptionCard({ label, icon, selected, onClick }: OptionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`text-2xl ${selected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
              {icon}
            </div>
          )}
          <span className={`font-semibold text-lg ${
            selected 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-slate-900 dark:text-slate-100'
          } transition-colors duration-300`}>
            {label}
          </span>
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}