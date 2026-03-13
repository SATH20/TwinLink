'use client';

import { motion } from 'framer-motion';

interface SimulationBubbleProps {
  message: string;
  sender: 'user' | 'other';
  delay?: number;
}

export default function SimulationBubble({ message, sender, delay = 0 }: SimulationBubbleProps) {
  const isUser = sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-md px-4 py-3 rounded-xl ${
          isUser
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
            : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
        } transition-colors duration-300`}
      >
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}