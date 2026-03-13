'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import MatchGrid from './MatchGrid';

export default function MatchRecommendationsLayout() {
  // Mock data - in real app, this would come from API
  const matches = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      initials: 'SM',
      compatibility: 87,
      interests: ['AI', 'Gaming', 'Technology'],
      gradient: 'from-blue-500 to-emerald-500',
    },
    {
      id: '2',
      name: 'Jordan Lee',
      initials: 'JL',
      compatibility: 92,
      interests: ['Music', 'Movies', 'Reading'],
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: '3',
      name: 'Taylor Chen',
      initials: 'TC',
      compatibility: 85,
      interests: ['Technology', 'Travel', 'Photography'],
      gradient: 'from-orange-500 to-red-500',
    },
    {
      id: '4',
      name: 'Morgan Davis',
      initials: 'MD',
      compatibility: 89,
      interests: ['Gaming', 'AI', 'Fitness'],
      gradient: 'from-teal-500 to-cyan-500',
    },
    {
      id: '5',
      name: 'Riley Parker',
      initials: 'RP',
      compatibility: 83,
      interests: ['Movies', 'Music', 'Art'],
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      id: '6',
      name: 'Casey Johnson',
      initials: 'CJ',
      compatibility: 90,
      interests: ['Technology', 'Gaming', 'Cooking'],
      gradient: 'from-emerald-500 to-green-500',
    },
  ];

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

          {/* Match Grid */}
          <MatchGrid matches={matches} />
        </div>
      </div>
    </div>
  );
}
