'use client';

import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Simulation {
  name: string;
  compatibility: number;
  date: string;
}

export default function SimulationWidget() {
  const simulations: Simulation[] = [
    { name: 'Alex Chen', compatibility: 87, date: '2 hours ago' },
    { name: 'Sara Kim', compatibility: 82, date: '5 hours ago' },
    { name: 'David Lee', compatibility: 79, date: '1 day ago' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md transition-colors duration-300 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
          Recent Simulations
        </h3>
        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>

      {/* Simulations List */}
      <div className="space-y-4">
        {simulations.map((sim, index) => (
          <div
            key={index}
            className="space-y-1 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-slate-900 dark:text-slate-100 font-medium transition-colors duration-300">
                Simulation with {sim.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                {sim.date}
              </span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium transition-colors duration-300">
                Compatibility: {sim.compatibility}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <Link
        href="/simulation"
        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 font-medium transition-all duration-300"
      >
        <span>View All Simulations</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
