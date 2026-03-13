'use client';

import { motion } from 'framer-motion';
import MatchCard from './MatchCard';

interface Match {
  id: string;
  name: string;
  initials: string;
  compatibility: number;
  interests: string[];
  gradient: string;
}

interface MatchGridProps {
  matches: Match[];
}

export default function MatchGrid({ matches }: MatchGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {matches.map((match, index) => (
        <MatchCard key={match.id} match={match} index={index} />
      ))}
    </motion.div>
  );
}
