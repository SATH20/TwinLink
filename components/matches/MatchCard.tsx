'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import CompatibilityBar from '@/components/matches/CompatibilityBar';
import InterestChip from '@/components/matches/InterestChip';


interface Match {
  id: string;
  name: string;
  initials: string;
  compatibility: number;
  interests: string[];
  gradient: string;
}

interface MatchCardProps {
  match: Match;
  index: number;
}

export default function MatchCard({ match, index }: MatchCardProps) {
  const handleConnect = () => {
    // In real app, this would trigger connection logic
    console.log(`Connecting with ${match.name}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 space-y-6"
    >
      {/* Avatar */}
      <div className="flex justify-center">
        <div
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${match.gradient} text-white flex items-center justify-center font-bold text-xl shadow-lg`}
        >
          {match.initials}
        </div>
      </div>

      {/* Name */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
          {match.name}
        </h3>
      </div>

      {/* Compatibility Score */}
      <CompatibilityBar score={match.compatibility} />

      {/* Interest Tags */}
      <div className="flex flex-wrap gap-2 justify-center">
        {match.interests.map((interest) => (
          <InterestChip key={interest} label={interest} />
        ))}
      </div>

      {/* Connect Button */}
      <button
        onClick={handleConnect}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
      >
        <Sparkles className="w-4 h-4" />
        Connect
      </button>
    </motion.div>
  );
}
