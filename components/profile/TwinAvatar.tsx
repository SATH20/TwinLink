'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TwinAvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TwinAvatar({ initials, size = 'lg' }: TwinAvatarProps) {
  const sizeClasses = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-24 h-24 text-2xl',
    lg: 'w-32 h-32 text-4xl',
  };

  return (
    <div className="relative inline-block">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur-2xl opacity-40 animate-glow"></div>
      
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white flex items-center justify-center font-bold shadow-xl`}
      >
        {initials}
        
        {/* Sparkle icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </motion.div>
      </motion.div>
    </div>
  );
}