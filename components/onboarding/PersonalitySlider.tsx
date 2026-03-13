'use client';

import { useState } from 'react';

interface PersonalitySliderProps {
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}

export default function PersonalitySlider({ leftLabel, rightLabel, value, onChange }: PersonalitySliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className={`text-sm font-medium transition-colors duration-300 ${
          value < 50 
            ? 'text-blue-600 dark:text-blue-400' 
            : 'text-slate-500 dark:text-slate-400'
        }`}>
          {leftLabel}
        </span>
        <span className={`text-sm font-medium transition-colors duration-300 ${
          value > 50 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : 'text-slate-500 dark:text-slate-400'
        }`}>
          {rightLabel}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer transition-colors duration-300"
          style={{
            background: `linear-gradient(to right, #2563eb ${value}%, #e2e8f0 ${value}%)`,
          }}
        />
        <style jsx>{`
          input[type='range']::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${isDragging ? '#1d4ed8' : '#2563eb'};
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
            transition: all 0.2s ease;
          }
          input[type='range']::-webkit-slider-thumb:hover {
            background: #1d4ed8;
            transform: scale(1.1);
          }
          input[type='range']::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${isDragging ? '#1d4ed8' : '#2563eb'};
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
            transition: all 0.2s ease;
          }
          input[type='range']::-moz-range-thumb:hover {
            background: #1d4ed8;
            transform: scale(1.1);
          }
        `}</style>
      </div>
      <div className="text-center">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {value < 30 ? leftLabel : value > 70 ? rightLabel : 'Balanced'}
        </span>
      </div>
    </div>
  );
}