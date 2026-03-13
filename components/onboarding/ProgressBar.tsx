'use client';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors duration-300">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors duration-300">
          {Math.round(progress)}%
        </span>
      </div>
      <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden transition-colors duration-300">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}