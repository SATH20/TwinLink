'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TwinAvatar from '../profile/TwinAvatar';
import SimulationLog from './SimulationLog';
import CompatibilityCard from './CompatibilityCard';

export default function SimulationLayout() {
  const router = useRouter();
  const [isSimulating, setIsSimulating] = useState(true);
  const [showResults, setShowResults] = useState(false);

  // Mock data
  const userTwin = {
    initials: 'AT',
    name: 'Alex',
  };

  const otherTwin = {
    initials: 'SM',
    name: 'Sam',
  };

  const messages = [
    { sender: 'user' as const, text: "Hi! I'm really interested in AI and technology. What are your thoughts on the future of machine learning?" },
    { sender: 'other' as const, text: "That's fascinating! I'm also passionate about AI. I think we're just scratching the surface of what's possible with neural networks." },
    { sender: 'user' as const, text: "Exactly! I've been exploring deep learning frameworks. Do you work on any AI projects?" },
    { sender: 'other' as const, text: "Yes! I'm currently working on a natural language processing project. It's challenging but incredibly rewarding." },
    { sender: 'user' as const, text: "That sounds amazing! I'd love to hear more about it. Maybe we could collaborate on something?" },
    { sender: 'other' as const, text: "I'd really enjoy that! It's rare to find someone who shares the same passion for AI and innovation." },
  ];

  const compatibilityData = {
    score: 87,
    explanation:
      'Your twins share strong compatibility in technology interests, communication style, and intellectual curiosity. Both value deep conversations and collaborative problem-solving, making this an excellent potential match.',
  };

  useEffect(() => {
    // Simulate the AI processing
    const timer = setTimeout(() => {
      setIsSimulating(false);
      setShowResults(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleConnect = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/profile"
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
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-12">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
              Twin Interaction Simulation
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 transition-colors duration-300">
              AI analyzing compatibility between digital twins
            </p>
          </motion.div>

          {/* Twin Avatars Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-8"
          >
            {/* User Twin */}
            <div className="text-center space-y-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl">
                  {userTwin.initials}
                </div>
                {isSimulating && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-40"
                  />
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-300">
                  Your Twin
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  {userTwin.name}
                </p>
              </div>
            </div>

            {/* Connection Arrow */}
            <div className="relative">
              <motion.div
                animate={isSimulating ? { x: [0, 10, 0] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex items-center gap-2"
              >
                <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" />
                <ArrowRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              {isSimulating && (
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400"
                >
                  <Zap className="w-3 h-3" />
                  Simulating...
                </motion.div>
              )}
            </div>

            {/* Other Twin */}
            <div className="text-center space-y-3">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-xl">
                  {otherTwin.initials}
                </div>
                {isSimulating && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                    className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-40"
                  />
                )}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-300">
                  Potential Match
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  {otherTwin.name}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Simulation Log */}
          <SimulationLog messages={messages} />

          {/* Compatibility Results */}
          {showResults && (
            <>
              <CompatibilityCard
                score={compatibilityData.score}
                explanation={compatibilityData.explanation}
              />

              {/* Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleConnect}
                  className="group relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Connect with this Match
                  </span>

                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-emerald-400 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                </button>
              </motion.div>
            </>
          )}

          {/* Loading State */}
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full text-blue-600 dark:text-blue-400 transition-colors duration-300">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
                <span className="font-medium">Analyzing compatibility...</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}