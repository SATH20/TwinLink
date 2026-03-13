'use client';

interface InterestChipProps {
  label: string;
}

export default function InterestChip({ label }: InterestChipProps) {
  return (
    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium transition-colors duration-300">
      {label}
    </span>
  );
}
