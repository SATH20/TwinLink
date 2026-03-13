'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import StatsRow from './StatsRow';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 bg-white dark:bg-[#0F172A] transition-colors duration-300">
      {/* Blurred gradient orbs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-400/20 dark:bg-emerald-300/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-sm font-medium mb-4 transition-colors duration-300 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-4 h-4" />
            <span>AI Powered Matchmaking Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1] transition-colors duration-300">
            Meet Your Digital Twin. <br />
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">Find Your Perfect Match.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
            AI-powered digital twins simulate conversations to discover meaningful connections before you even say hello.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold text-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25"
            >
              <Link href="/auth">Create Your Twin</Link>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-lg hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-800 transition-all duration-300"
            >
              Explore How It Works
            </motion.button>
          </div>

          <StatsRow />

          {/* Matchmaking Visual Element with Digital Twin Aura */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative mt-20 max-w-2xl mx-auto"
          >
            <div className="relative flex items-center justify-between p-8">
              {/* User Avatar with Twin Aura */}
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
                  <div className="w-full h-full bg-blue-500 dark:bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">U</div>
                </div>
                <div className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 text-center transition-colors duration-300">You</div>
              </div>

              {/* Animated Connection Line with Compatibility Gradient */}
              <div className="flex-1 relative mx-4 h-1">
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors duration-300" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  style={{ transformOrigin: "left" }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest shadow-sm transition-colors duration-300">
                  Simulating...
                </div>
              </div>

              {/* Digital Twin Avatar with Twin Aura */}
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
                  <div className="w-full h-full bg-emerald-500 dark:bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">T</div>
                </div>
                <div className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400 text-center transition-colors duration-300">Twin</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
