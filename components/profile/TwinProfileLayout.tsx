'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TwinAvatar from './TwinAvatar';
import TwinSummaryCard from './TwinSummaryCard';
import TraitBar from './TraitBar';
import InterestChip from './InterestChip';

export default function TwinProfileLayout() {
  const router = useRouter();

  // Mock data - in real app, this would come from API/state
  const twinData = {
    name: 'Alex',
    initials: 'AT',
    summary:
      'Your digital twin is curious, analytical, and enjoys meaningful conversations about technology and innovation. You have a balanced personality that combines logical thinking with creative problem-solving. You value deep connections and intellectual discussions.',
    traits: [
      { label: 'Introversion', value: 65 },
      { label: 'Creativity', value: 78 },
      { label: 'Logic', value: 82 },
      { label: 'Humor', value: 70 },
    ],
    interests: ['Gaming', 'Technology', 'AI', 'Movies', 'Music', 'Reading'],
  };

  const handleStartSimulation = () => {
    // Navigate to simulation page
    router.push('/simulation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-6 py-4">
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
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            {/* Avatar */}
            <div className="flex justify-center">
              <TwinAvatar initials={twinData.initials} />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
                Meet Your Digital Twin
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors duration-300">
                AI-generated personality profile for {twinData.name}
              </p>
            </div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium transition-colors duration-300"
            >
              <Zap className="w-4 h-4" />
              <span>Twin Active</span>
            </motion.div>
          </motion.div>

          {/* AI Summary Card */}
          <TwinSummaryCard summary={twinData.summary} />

          {/* Personality Traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors duration-300"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 transition-colors duration-300">
              Personality Traits
            </h3>
            <div className="space-y-6">
              {twinData.traits.map((trait, index) => (
                <TraitBar
                  key={trait.label}
                  label={trait.label}
                  value={trait.value}
                  delay={0.4 + index * 0.1}
                />
              ))}
            </div>
          </motion.div>

          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-lg transition-colors duration-300"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 transition-colors duration-300">
              Interests & Hobbies
            </h3>
            <div className="flex flex-wrap gap-3">
              {twinData.interests.map((interest, index) => (
                <InterestChip key={interest} label={interest} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex justify-center pt-8"
          >
            <button
              onClick={handleStartSimulation}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Start Twin Simulation
              </span>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-emerald-400 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </button>
          </motion.div>

          {/* Info Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-center text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300"
          >
            Your digital twin will now interact with other twins to find compatible matches
          </motion.p>
        </div>
      </div>
    </div>
  );
}