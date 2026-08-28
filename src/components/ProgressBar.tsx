import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  numberText: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestion,
  totalQuestions,
  numberText,
}) => {
  const percentage = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <div id="quiz-progress-section" className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-bold text-[#00381D] bg-[#F0F7F2] px-3 py-1 rounded-full border border-[#006837]/20">
          {numberText}
        </span>
        <span className="font-semibold text-slate-500">
          ความคืบหน้า <strong className="text-[#004D28] font-bold">{percentage}%</strong>
        </span>
      </div>

      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-[#004D28] via-[#006837] to-[#D4AF37] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
