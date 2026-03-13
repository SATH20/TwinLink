'use client';

import { motion } from 'framer-motion';
import SimulationBubble from './SimulationBubble';

interface Message {
  sender: 'user' | 'other';
  text: string;
}

interface SimulationLogProps {
  messages: Message[];
}

export default function SimulationLog({ messages }: SimulationLogProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg transition-colors duration-300"
    >
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
          Twin Interaction Simulation
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
          AI-powered conversation analysis
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <SimulationBubble
            key={index}
            message={message.text}
            sender={message.sender}
            delay={0.5 + index * 0.2}
          />
        ))}
      </div>
    </motion.div>
  );
}