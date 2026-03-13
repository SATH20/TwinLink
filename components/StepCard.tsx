'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

type StepCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
};

export default function StepCard({ icon: Icon, title, description, index }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 transition-colors duration-300">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 transition-colors duration-300">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">{description}</p>
    </motion.div>
  );
}
