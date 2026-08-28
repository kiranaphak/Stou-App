import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { QuizQuestion, UserAnswers } from '../types';
import { ProgressBar } from './ProgressBar';

interface QuizProps {
  questions: QuizQuestion[];
  currentStep: number;
  answers: UserAnswers;
  onSelectOption: (questionId: number, optionId: string) => void;
  onPrevStep: () => void;
  onRestart: () => void;
}

export const Quiz: React.FC<QuizProps> = ({
  questions,
  currentStep,
  answers,
  onSelectOption,
  onPrevStep,
  onRestart,
}) => {
  const currentQuestion = questions[currentStep];
  const totalQuestions = questions.length;

  // Map selected option ID for the current question
  let selectedOptionId: string | undefined;
  switch (currentQuestion.id) {
    case 1:
      selectedOptionId = answers.lifeStage || answers.q1_stage;
      break;
    case 2:
      selectedOptionId = answers.learningGoal || answers.q2_education;
      break;
    case 3:
      selectedOptionId = answers.desiredOutcome || answers.q3_hours;
      break;
    case 4:
      selectedOptionId = answers.interestArea || answers.q6_interest;
      break;
    case 5:
      selectedOptionId = answers.futureUse || answers.q5_outcome;
      break;
    case 6:
      selectedOptionId = answers.learningFormat || answers.q4_goal;
      break;
    default:
      selectedOptionId = undefined;
  }

  return (
    <div id="quiz-container" className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-5">
      {/* Top Controls: Back and Restart */}
      <div className="flex items-center justify-between">
        <button
          id="btn-quiz-back"
          type="button"
          onClick={onPrevStep}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#00381D] bg-white border border-slate-200 shadow-2xs hover:bg-[#F0F7F2] active:scale-[0.98] transition-all cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>ย้อนกลับ</span>
        </button>

        <button
          id="btn-quiz-restart"
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 bg-transparent hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>เริ่มใหม่</span>
        </button>
      </div>

      {/* Progress Bar Component */}
      <ProgressBar
        currentQuestion={currentStep + 1}
        totalQuestions={totalQuestions}
        numberText={`คำถาม ${currentStep + 1} จาก ${totalQuestions}`}
      />

      {/* Question Card with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="space-y-4"
        >
          {/* Question Header */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#006837]/15 shadow-sm space-y-2">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#004D28] text-[#E5C158] flex items-center justify-center font-black text-[16px] flex-shrink-0 mt-0.5 shadow-2xs">
                {currentQuestion.id}
              </div>
              <div className="space-y-1">
                <h2 className="text-[20px] sm:text-[22px] md:text-[24px] font-black text-[#00381D] leading-[1.3]">
                  {currentQuestion.title}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-[15px] sm:text-[16px] text-[#475569] leading-[1.65]">
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOptionId === option.id;

              return (
                <motion.button
                  key={option.id}
                  id={`btn-option-${currentQuestion.id}-${option.id}`}
                  type="button"
                  whileTap={{ scale: 0.985 }}
                  onClick={() => onSelectOption(currentQuestion.id, option.id)}
                  className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 relative cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-[#EBF7EE] text-[#00381D] border-[#004D28] ring-2 ring-[#D4AF37]/40 shadow-md'
                      : 'bg-white text-[#1E293B] border-slate-200 hover:border-[#006837]/40 hover:bg-[#F8FAF9]'
                  }`}
                >
                  {/* Option Badge/Index */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'bg-[#004D28] text-[#E5C158]'
                        : 'bg-[#F1F5F9] text-[#475569]'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Option Label & Subtext */}
                  <div className="flex-1 min-w-0 pr-2 space-y-0.5">
                    <p
                      className={`text-[16px] sm:text-[17px] font-bold leading-[1.4] ${
                        isSelected ? 'text-[#00381D]' : 'text-[#1E293B]'
                      }`}
                    >
                      {option.label}
                    </p>
                    {option.sublabel && (
                      <p
                        className={`text-[14px] sm:text-[15px] leading-[1.6] ${
                          isSelected ? 'text-[#004D28]' : 'text-[#475569]'
                        }`}
                      >
                        {option.sublabel}
                      </p>
                    )}
                  </div>

                  {/* Check Indicator */}
                  {isSelected && (
                    <div className="flex-shrink-0 self-center">
                      <CheckCircle2 className="w-6 h-6 text-[#006837]" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
