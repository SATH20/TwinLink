'use client';

import { motion } from 'framer-motion';

interface InterestChipProps {
  label: string;
  index: number;
}

export default function InterestChip({ label, index }: InterestChipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium border border-blue-200 dark:border-blue-800 transition-colors duration-300"
    >
      {label}
    </motion.div>
  );
}