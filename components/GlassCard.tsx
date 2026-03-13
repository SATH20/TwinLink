'use client';

type Props = {
  className?: string;
  children: React.ReactNode;
};

export default function GlassCard({ className, children }: Props) {
  return (
    <div className={`glass dark:glass glass-light border border-gray-300 dark:border-white/20 rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/20 ${className ?? ''}`}>
      {children}
    </div>
  );
}
