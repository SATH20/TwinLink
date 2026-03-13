'use client';

export default function StatsRow() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 mt-12">
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">10K+</div>
        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium transition-colors duration-300">Active Twins</div>
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">95%</div>
        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium transition-colors duration-300">Match Success</div>
      </div>
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 transition-colors duration-300">50K+</div>
        <div className="text-sm text-slate-600 dark:text-slate-400 font-medium transition-colors duration-300">Connections</div>
      </div>
    </div>
  );
}
