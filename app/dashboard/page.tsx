import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard - TwinLink',
  description: 'Your TwinLink dashboard - manage your digital twin and discover matches.',
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center space-y-8">
          {/* Success Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-full blur-xl opacity-50 animate-glow"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">
              Your Digital Twin is Ready! 🎉
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">
              We&apos;ve created your AI-powered digital twin based on your personality profile. 
              Your twin is now analyzing potential matches to find meaningful connections.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-colors duration-300">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">AI Twin Active</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your digital twin is simulating conversations
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-colors duration-300">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Finding Matches</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Analyzing compatibility with other twins
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-colors duration-300">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Coming Soon</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                You&apos;ll receive match notifications shortly
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}