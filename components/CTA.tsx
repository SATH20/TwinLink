'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-white dark:bg-[#0F172A] transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 to-emerald-500 dark:from-blue-500 dark:to-emerald-400 p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-500/20 dark:shadow-blue-400/20 transition-all duration-300"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Ready to discover your digital twin?
            </h2>
            <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto leading-relaxed">
              Join thousands of others who are already using AI to find more meaningful connections through simulation.
            </p>
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl"
              >
                <Link href="/auth">Create Your Twin Now</Link>
              </motion.button>
            </div>
            <p className="text-sm text-blue-100/80">
              Free to start • No credit card required • 2 minutes setup
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
