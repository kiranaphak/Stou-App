/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Welcome } from './components/Welcome';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { PrivacyNotice } from './components/PrivacyNotice';
import { QUIZ_QUESTIONS } from './data/questions';
import { calculateQuizResults } from './utils/scoring';
import { ScoredProgram } from './types';

type AppView = 'welcome' | 'quiz' | 'results' | 'advisory';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [scoredResults, setScoredResults] = useState<ScoredProgram[]>([]);
  const [preselectedProgramId, setPreselectedProgramId] = useState<string | undefined>(undefined);

  // Start the quiz from the welcome screen
  const handleStartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Option selection
  const handleSelectOption = (questionId: number, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Move to next question
  const handleNext = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Go to previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('welcome');
    }
  };

  // Restart quiz completely
  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setScoredResults([]);
    setPreselectedProgramId(undefined);
    setCurrentView('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit and calculate results (deterministic rule-based algorithm)
  const handleSubmit = () => {
    const results = calculateQuizResults(answers);
    setScoredResults(results);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open advisory request view
  const handleRequestConsultation = (programId?: string) => {
    setPreselectedProgramId(programId);
    setCurrentView('advisory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to results from advisory view
  const handleBackToResults = () => {
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const top3Programs = scoredResults.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Prompt',sans-serif]">
      {/* Top Header */}
      <Header currentView={currentView} onRestart={handleRestart} />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'welcome' && (
          <Welcome onStart={handleStartQuiz} />
        )}

        {currentView === 'quiz' && (
          <Quiz
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onSelectOption={handleSelectOption}
            onNext={handleNext}
            onPrev={handlePrev}
            onRestart={handleRestart}
            onSubmit={handleSubmit}
          />
        )}

        {currentView === 'results' && (
          <Results
            topPrograms={top3Programs}
            allRankedPrograms={scoredResults}
            onRestart={handleRestart}
            onRequestConsultation={handleRequestConsultation}
          />
        )}

        {currentView === 'advisory' && (
          <PrivacyNotice
            topPrograms={top3Programs}
            preselectedProgramId={preselectedProgramId}
            onBackToResults={handleBackToResults}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#002B16] text-slate-300 text-xs py-5 px-4 border-t-2 border-[#D4AF37]/40 text-center space-y-1 mt-auto">
        <p className="font-semibold text-[#E5C158]">
          มหาวิทยาลัยสุโขทัยธรรมาธิราช (มสธ.) | Sukhothai Thammathirat Open University (STOU)
        </p>
        <p className="text-[11px] text-slate-300">
          ระบบประมวลผลคำแนะนำหลักสูตรเบื้องต้น • ออกแบบสำหรับผู้ใช้งานบนโทรศัพท์มือถือและนิทรรศการ
        </p>
      </footer>
    </div>
  );
}
