'use client';

import { motion } from 'framer-motion';

interface DashboardGridProps {
  children: React.ReactNode;
}

export default function DashboardGrid({ children }: DashboardGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {children}
    </motion.div>
  );
}
