'use client';

import { motion } from 'framer-motion';

interface TraitBarProps {
  label: string;
  value: number;
  delay?: number;
}

export default function TraitBar({ label, value, delay = 0 }: TraitBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-300">
          {label}
        </span>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">
          {value}%
        </span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-300">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
        />
      </div>
    </div>
  );
}