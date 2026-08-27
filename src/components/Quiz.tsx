import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, RotateCcw, ArrowRight, Check, HelpCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/questions';
import { IconHelper } from './IconHelper';

interface QuizProps {
  currentQuestionIndex: number;
  answers: Record<number, string>;
  onSelectOption: (questionId: number, optionId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
  onSubmit: () => void;
}

export const Quiz: React.FC<QuizProps> = ({
  currentQuestionIndex,
  answers,
  onSelectOption,
  onNext,
  onPrev,
  onRestart,
  onSubmit,
}) => {
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentAnswer = answers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleOptionClick = (optionId: string) => {
    onSelectOption(currentQuestion.id, optionId);
  };

  return (
    <div id="quiz-container" className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col min-h-[calc(100vh-5.5rem)] justify-between">
      {/* Top Header & Progress Bar */}
      <div id="quiz-header" className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            id="btn-prev-question"
            type="button"
            onClick={onPrev}
            disabled={currentQuestionIndex === 0}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentQuestionIndex === 0
                ? 'text-slate-300 bg-slate-100/60 cursor-not-allowed border border-transparent'
                : 'text-[#004D28] bg-white border border-[#006837]/20 shadow-2xs hover:bg-[#F4F9F5] active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>

          {/* Question Step Indicator */}
          <div className="flex items-center gap-2">
            <span
              id="quiz-step-label"
              className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-bold bg-[#004D28] text-[#E5C158] border border-[#D4AF37]/50 shadow-xs"
            >
              <span>{currentQuestion.numberText}</span>
            </span>
          </div>

          <button
            id="btn-restart-quiz"
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-white border border-slate-200 shadow-2xs hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="เริ่มทำแบบทดสอบใหม่ตั้งแต่ต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">เริ่มใหม่</span>
          </button>
        </div>

        {/* Dynamic Progress Bar (Green to Gold) */}
        <div className="w-full bg-slate-200/80 h-3 rounded-full overflow-hidden p-0.5 shadow-inner border border-slate-200">
          <motion.div
            id="quiz-progress-bar"
            className="h-full bg-gradient-to-r from-[#004D28] via-[#0B7A42] to-[#D4AF37] rounded-full"
            initial={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main Question Card with Smooth Transition Animation */}
      <div id="quiz-card-wrapper" className="my-auto py-4 sm:py-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 24, scale: 0.99 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, scale: 0.99 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="space-y-4"
          >
            {/* Question Title Card */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-[#006837]/15 shadow-sm">
              <div className="flex items-start gap-3.5">
                <span className="flex-shrink-0 w-9 h-9 rounded-2xl bg-[#004D28] text-[#E5C158] font-black text-base flex items-center justify-center shadow-xs border border-[#D4AF37]/40">
                  {currentQuestion.id}
                </span>
                <div>
                  <h2 id={`question-title-${currentQuestion.id}`} className="text-lg sm:text-xl font-bold text-[#00381D] leading-snug">
                    {currentQuestion.title}
                  </h2>
                  {currentQuestion.subtitle && (
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                      {currentQuestion.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Options List */}
            <div id={`options-group-${currentQuestion.id}`} className="space-y-3" role="radiogroup">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = currentAnswer === option.id;
                return (
                  <motion.button
                    key={option.id}
                    id={`opt-btn-${currentQuestion.id}-${idx}`}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleOptionClick(option.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border-2 transition-all flex items-start gap-3.5 shadow-2xs cursor-pointer ${
                      isSelected
                        ? 'bg-[#00381D] text-white border-[#D4AF37] ring-2 ring-[#D4AF37]/40 shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-[#006837]/40 hover:bg-[#F4F9F5]'
                    }`}
                  >
                    {/* Icon container */}
                    <div
                      className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#D4AF37] text-[#00381D] font-bold shadow-xs'
                          : 'bg-[#F0F7F2] text-[#006837]'
                      }`}
                    >
                      {option.iconName ? (
                        <IconHelper name={option.iconName} className="w-5 h-5" />
                      ) : (
                        <span className="font-bold text-sm">{String.fromCharCode(65 + idx)}</span>
                      )}
                    </div>

                    {/* Option Text */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`font-bold text-base sm:text-lg leading-snug ${
                            isSelected ? 'text-[#E5C158]' : 'text-[#00381D]'
                          }`}
                        >
                          {option.text}
                        </p>
                        {isSelected && (
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] text-[#00381D] flex items-center justify-center shadow-xs">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      {option.subtext && (
                        <p
                          className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                            isSelected ? 'text-slate-200' : 'text-slate-500'
                          }`}
                        >
                          {option.subtext}
                        </p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Footer */}
      <div id="quiz-footer" className="pt-3 pb-2 border-t border-slate-200/80 mt-2">
        {isLastQuestion ? (
          <button
            id="btn-submit-quiz"
            type="button"
            onClick={onSubmit}
            disabled={!currentAnswer}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-md transition-all ${
              currentAnswer
                ? 'bg-gradient-to-r from-[#004D28] via-[#006837] to-[#0B7A42] text-[#E5C158] border-2 border-[#D4AF37]/50 hover:brightness-110 active:scale-[0.99] cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <span>ดูผลลัพธ์ 3 กลุ่มสาขาวิชาที่เหมาะกับคุณ</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            id="btn-next-question"
            type="button"
            onClick={onNext}
            disabled={!currentAnswer}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-sm transition-all ${
              currentAnswer
                ? 'bg-[#004D28] text-[#E5C158] border border-[#D4AF37]/40 hover:bg-[#00381D] active:scale-[0.99] cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <span>ข้อถัดไป</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {!currentAnswer && (
          <p className="text-center text-xs text-slate-400 mt-2 font-medium">
            กรุณาเลือก 1 ตัวเลือกเพื่อไปยังข้อถัดไป
          </p>
        )}
      </div>
    </div>
  );
};

