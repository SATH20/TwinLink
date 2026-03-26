'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import MatchGrid from './MatchGrid';

interface Match {
  id: string;
  matchScore: number;
  reason: string;
  interests: string[];
}

interface MatchRecommendationsLayoutProps {
  matches: Match[];
  isLoading: boolean;
}

export default function MatchRecommendationsLayout({ matches, isLoading }: MatchRecommendationsLayoutProps) {
  // Transform API matches to component format
  const formattedMatches = matches.map((match, index) => ({
    id: match.id,
    name: `Match #${index + 1}`,
    initials: `M${index + 1}`,
    compatibility: Math.round(match.matchScore * 100),
    interests: match.interests,
    gradient: getGradient(index),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-lg text-slate-900 dark:text-slate-100">TwinLink</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="space-y-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
              Your Best Matches
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors duration-300">
              AI-selected connections based on twin compatibility
            </p>
          </motion.div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Finding your matches...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && matches.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-slate-600 dark:text-slate-400">No matches found yet</p>
              <p className="text-slate-500 dark:text-slate-500 mt-2">
                Check back soon for new connections!
              </p>
            </div>
          )}

          {/* Match Grid */}
          {!isLoading && matches.length > 0 && <MatchGrid matches={formattedMatches} />}
        </div>
      </div>
    </div>
  );
}

// Helper function to get gradient based on index
function getGradient(index: number): string {
  const gradients = [
    'from-blue-500 to-emerald-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-teal-500 to-cyan-500',
    'from-indigo-500 to-blue-500',
    'from-emerald-500 to-green-500',
  ];
  return gradients[index % gradients.length];
}
