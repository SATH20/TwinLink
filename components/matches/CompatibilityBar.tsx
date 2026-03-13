'use client';

import { motion } from 'framer-motion';

interface CompatibilityBarProps {
  score: number;
}

export default function CompatibilityBar({ score }: CompatibilityBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300">
          Compatibility
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium transition-colors duration-300">
          {score}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-300">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
        />
      </div>
    </div>
  );
}
