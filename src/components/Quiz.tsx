import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, RotateCcw, ArrowRight, Check } from 'lucide-react';
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
    <div id="quiz-container" className="w-full max-w-xl mx-auto px-4 py-4 sm:py-6 flex flex-col min-h-[calc(100vh-5rem)] justify-between">
      {/* Top Header & Progress */}
      <div id="quiz-header" className="space-y-3">
        <div className="flex items-center justify-between">
          <button
            id="btn-prev-question"
            type="button"
            onClick={onPrev}
            disabled={currentQuestionIndex === 0}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentQuestionIndex === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 bg-white border border-slate-200 shadow-xs hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>

          <div className="flex items-center gap-2">
            <span id="quiz-step-label" className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-950 text-amber-300 tracking-wide border border-amber-500/30 shadow-xs">
              {currentQuestion.numberText}
            </span>
          </div>

          <button
            id="btn-restart-quiz"
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 shadow-xs hover:text-red-600 hover:bg-red-50 transition-colors"
            title="เริ่มทำแบบทดสอบใหม่ตั้งแต่ต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">เริ่มใหม่</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
          <motion.div
            id="quiz-progress-bar"
            className="h-full bg-gradient-to-r from-sky-900 via-sky-800 to-amber-500 rounded-full"
            initial={{ width: `${(currentQuestionIndex / totalQuestions) * 100}%` }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Main Question Card with Motion */}
      <div id="quiz-card-wrapper" className="my-auto py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Question Title */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-sky-900 text-amber-300 font-bold text-base flex items-center justify-center shadow-xs">
                  {currentQuestion.id}
                </span>
                <div>
                  <h2 id={`question-title-${currentQuestion.id}`} className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {currentQuestion.title}
                  </h2>
                  {currentQuestion.subtitle && (
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      {currentQuestion.subtitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Options List */}
            <div id={`options-group-${currentQuestion.id}`} className="space-y-2.5" role="radiogroup">
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
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border-2 transition-all flex items-start gap-3.5 shadow-xs ${
                      isSelected
                        ? 'bg-sky-950 text-white border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-sky-700/50 hover:bg-sky-50/50'
                    }`}
                  >
                    {/* Icon container */}
                    <div
                      className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-sky-950 font-bold shadow-xs'
                          : 'bg-slate-100 text-sky-900'
                      }`}
                    >
                      {option.iconName ? (
                        <IconHelper name={option.iconName} className="w-5 h-5" />
                      ) : (
                        <span className="font-semibold text-sm">{String.fromCharCode(65 + idx)}</span>
                      )}
                    </div>

                    {/* Option Text */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`font-semibold text-base sm:text-lg leading-snug ${
                          isSelected ? 'text-white' : 'text-slate-900'
                        }`}>
                          {option.text}
                        </p>
                        {isSelected && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-400 text-sky-950 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
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
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-sky-950 hover:brightness-105 active:scale-[0.99] cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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
                ? 'bg-sky-950 text-amber-300 hover:bg-sky-900 active:scale-[0.99] cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>ข้อถัดไป</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {!currentAnswer && (
          <p className="text-center text-xs text-slate-400 mt-2 font-light">
            กรุณาเลือก 1 คำตอบเพื่อไปยังข้อถัดไป
          </p>
        )}
      </div>
    </div>
  );
};
