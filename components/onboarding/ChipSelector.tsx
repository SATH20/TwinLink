'use client';

import { motion } from 'framer-motion';

interface ChipSelectorProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function ChipSelector({ options, selected, onChange }: ChipSelectorProps) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <motion.button
            key={option}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleOption(option)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              isSelected
                ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400'
            }`}
          >
            {option}
          </motion.button>
        );
      })}
    </div>
  );
}