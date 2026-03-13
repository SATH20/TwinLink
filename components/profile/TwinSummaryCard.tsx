'use client';

import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface TwinSummaryCardProps {
  summary: string;
}

export default function TwinSummaryCard({ summary }: TwinSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 transition-colors duration-300">
            AI Personality Analysis
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
            {summary}
          </p>
        </div>
      </div>
    </motion.div>
  );
}