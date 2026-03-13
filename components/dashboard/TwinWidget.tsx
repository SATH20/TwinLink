'use client';

import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TwinWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md transition-colors duration-300 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
          Your Digital Twin
        </h3>
        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Avatar */}
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
          AT
        </div>
      </div>

      {/* Personality Summary */}
      <div className="text-center space-y-2">
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
          Personality Traits
        </p>
        <p className="text-slate-900 dark:text-slate-100 font-medium transition-colors duration-300">
          Curious • Analytical • Collaborative
        </p>
      </div>

      {/* View Profile Link */}
      <Link
        href="/profile"
        className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300"
      >
        <span>View Full Profile</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
