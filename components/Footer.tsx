'use client';

import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 transition-colors duration-300" />
              <span className="text-2xl font-bold cobalt-gradient-text">TwinLink</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed transition-colors duration-300">
              The world&apos;s first AI-powered matchmaking platform using digital twin simulations for deeper human connection.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase text-xs tracking-widest transition-colors duration-300">Product</h4>
            <ul className="space-y-4">
              <li><a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Features</a></li>
              <li><a href="#how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">How it Works</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-6 uppercase text-xs tracking-widest transition-colors duration-300">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">About Us</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Careers</a></li>
              <li><a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
          <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors duration-300">
            © 2026 TwinLink AI. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
