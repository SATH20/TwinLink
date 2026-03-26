'use client';

import { motion } from 'framer-motion';
import { Heart, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Match {
  id: string;
  matchScore: number;
  reason: string;
  interests: string[];
}

interface MatchesWidgetProps {
  matches: Match[];
  isLoading: boolean;
}

export default function MatchesWidget({ matches, isLoading }: MatchesWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md transition-colors duration-300 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
          New Matches
        </h3>
        <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && matches.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">No matches found yet</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">
            Check back soon for new connections!
          </p>
        </div>
      )}

      {/* Matches List */}
      {!isLoading && matches.length > 0 && (
        <>
          <div className="space-y-4">
            {matches.slice(0, 3).map((match, index) => (
              <div
                key={match.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors duration-300"
              >
                <div className="flex-1">
                  <span className="text-slate-900 dark:text-slate-100 font-medium transition-colors duration-300 block">
                    Match #{index + 1}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {match.interests.slice(0, 2).join(', ')}
                  </span>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium transition-colors duration-300">
                  {Math.round(match.matchScore * 100)}%
                </span>
              </div>
            ))}
          </div>

          {/* View All Link */}
          <Link
            href="/matches"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 font-medium transition-all duration-300"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}
    </motion.div>
  );
}
