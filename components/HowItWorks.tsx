'use client';

import { motion } from 'framer-motion';
import { UserPlus, Bot, Heart } from 'lucide-react';
import StepCard from './StepCard';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Digital Twin',
    description: 'Answer questions about your personality, interests, and values. Our AI builds a sophisticated digital version of you.',
  },
  {
    icon: Bot,
    title: 'Twins Interact & Simulate',
    description: 'Your digital twin meets other twins in simulated conversations, analyzing compatibility across multiple dimensions.',
  },
  {
    icon: Heart,
    title: 'Get Meaningful Matches',
    description: 'Receive curated matches based on deep compatibility analysis. Connect with confidence knowing the AI has done the groundwork.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-slate-100 mb-4 transition-colors duration-300">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">
            Three simple steps to discover your perfect match through AI-powered compatibility analysis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
