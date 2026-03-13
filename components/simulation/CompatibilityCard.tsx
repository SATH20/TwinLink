'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, TrendingUp } from 'lucide-react';

interface CompatibilityCardProps {
  score: number;
  explanation: string;
}

export default function CompatibilityCard({ score, explanation }: CompatibilityCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Potential Match';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-xl transition-colors duration-300"
    >
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full blur-xl opacity-40"
            />
          </div>
        </div>

        {/* Score */}
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1, type: 'spring' }}
            className={`text-6xl font-bold ${getScoreColor(score)} transition-colors duration-300`}
          >
            {score}%
          </motion.div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-lg font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">
              {getScoreLabel(score)}
            </span>
          </div>
        </div>

        {/* Explanation */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed text-left transition-colors duration-300">
              {explanation}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}