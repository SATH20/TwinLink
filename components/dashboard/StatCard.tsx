'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  index: number;
}

export default function StatCard({ title, value, icon: Icon, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md transition-colors duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
            {title}
          </p>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {value}
          </p>
        </div>
        <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center transition-colors duration-300">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </motion.div>
  );
}
