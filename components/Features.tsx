'use client';

import { motion } from 'framer-motion';
import { Brain, MessageSquare, Target, Zap } from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: Brain,
    title: 'AI Personality Modeling',
    description: 'Advanced machine learning creates a nuanced digital representation of your personality, values, and communication style.',
  },
  {
    icon: MessageSquare,
    title: 'Twin Interaction Simulation',
    description: 'Your digital twin engages in thousands of simulated conversations to evaluate chemistry and compatibility.',
  },
  {
    icon: Target,
    title: 'Compatibility Scoring',
    description: 'Multi-dimensional analysis provides detailed compatibility scores across personality, interests, and life goals.',
  },
  {
    icon: Zap,
    title: 'Smart Match Recommendations',
    description: 'Receive curated matches ranked by compatibility, with insights into why you might connect with each person.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 relative overflow-hidden bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
            Powerful Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">
            Cutting-edge AI technology designed to help you find meaningful connections
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
