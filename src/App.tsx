import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Welcome } from './components/Welcome';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { PrivacyNotice } from './components/PrivacyNotice';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { QUIZ_QUESTIONS } from './data/questions';
import { calculateQuizResult } from './utils/scoring';
import { ScoringResult, UserAnswers, AnonymousQuizSessionPayload } from './types';
import {
  trackEvent,
  saveQuizSession,
  generateUniqueQuizAttemptId,
  APP_VERSION,
} from './lib/firebase';
import {
  saveQuizResultSession,
  getQuizResultSession,
  clearQuizResultSession,
} from './lib/quizSession';

export type AppView = 'welcome' | 'quiz' | 'results' | 'advisory' | 'admin';

export function App() {
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);

  // Synchronize view state with browser path/query
  const syncRouteFromLocation = useCallback(() => {
    if (typeof window === 'undefined') return;

    const path = window.location.pathname.toLowerCase();
    const params = new URLSearchParams(window.location.search);

    let targetView: AppView = 'welcome';

    if (params.get('admin') === 'true' || params.get('view') === 'admin' || path === '/admin') {
      targetView = 'admin';
    } else if (path === '/result' || path === '/results' || params.get('view') === 'result') {
      targetView = 'results';
      // Attempt restore from sessionStorage
      const savedSession = getQuizResultSession();
      if (savedSession) {
        setScoringResult(savedSession.scoringResult);
        setAnswers(savedSession.answers);
      }
    } else if (path === '/quiz' || params.get('view') === 'quiz') {
      targetView = 'quiz';
    } else if (path === '/advisory' || params.get('view') === 'advisory') {
      targetView = 'advisory';
    } else {
      targetView = 'welcome';
    }

    setCurrentView(targetView);
  }, []);

  // Initial load
  useEffect(() => {
    syncRouteFromLocation();

    // Handle Browser Back / Forward buttons without reloading or losing state
    const handlePopState = () => {
      syncRouteFromLocation();
    };

    window.addEventListener('popstate', handlePopState);
    trackEvent('quiz_viewed', {});

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncRouteFromLocation]);

  // Navigate function using pushState without page reload
  const navigateTo = (view: AppView, replace = false) => {
    setCurrentView(view);

    if (typeof window !== 'undefined') {
      let routePath = '/';
      if (view === 'quiz') routePath = '/quiz';
      else if (view === 'results') routePath = '/result';
      else if (view === 'admin') routePath = '/admin';
      else if (view === 'advisory') routePath = '/advisory';

      const currentPath = window.location.pathname;
      if (currentPath !== routePath) {
        if (replace) {
          window.history.replaceState(null, '', routePath);
        } else {
          window.history.pushState(null, '', routePath);
        }
      }
    }
  };

  // Start Quiz
  const handleStartQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setScoringResult(null);
    navigateTo('quiz');
    trackEvent('quiz_started', {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select option in Quiz
  const handleSelectOption = async (questionId: number, optionId: string) => {
    const updatedAnswers: UserAnswers = { ...answers };

    switch (questionId) {
      case 1:
        updatedAnswers.lifeStage = optionId;
        updatedAnswers.q1_stage = optionId;
        break;
      case 2:
        updatedAnswers.learningGoal = optionId;
        updatedAnswers.q2_education = optionId;
        break;
      case 3:
        updatedAnswers.desiredOutcome = optionId;
        updatedAnswers.q3_hours = optionId;
        break;
      case 4:
        updatedAnswers.interestArea = optionId;
        updatedAnswers.q6_interest = optionId;
        break;
      case 5:
        updatedAnswers.futureUse = optionId;
        updatedAnswers.q5_outcome = optionId;
        break;
      case 6:
        updatedAnswers.learningFormat = optionId;
        updatedAnswers.q4_goal = optionId;
        break;
    }

    setAnswers(updatedAnswers);

    // Track answer event
    try {
      trackEvent('quiz_question_answered', {
        question_number: questionId,
        answer_key: optionId,
      });
    } catch {
      // Ignore
    }

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed all 6 questions - Calculate result
      const result = calculateQuizResult(updatedAnswers);
      setScoringResult(result);

      // Save to sessionStorage so that page refreshes or external navigation can restore result
      saveQuizResultSession(result, updatedAnswers);

      navigateTo('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Build anonymous payload for Firestore and analytics (Strictly NO PII)
      const sessionId = generateUniqueQuizAttemptId();
      const topProg = result.topRecommendedPrograms[0];

      try {
        trackEvent('quiz_completed', {
          persona: result.primaryPathway.id,
          top_school_code: topProg?.schoolCode || '',
          top_program_id: topProg?.programId || '',
          interest_area: updatedAnswers.interestArea || '',
        });
      } catch {
        // Ignore
      }

      const payload: AnonymousQuizSessionPayload = {
        sessionId,
        completedAt: new Date().toISOString(),
        appVersion: APP_VERSION,
        answers: {
          lifeStage: updatedAnswers.lifeStage || '',
          learningGoal: updatedAnswers.learningGoal || '',
          desiredOutcome: updatedAnswers.desiredOutcome || '',
          interestArea: updatedAnswers.interestArea || '',
          futureUse: updatedAnswers.futureUse || '',
          learningFormat: updatedAnswers.learningFormat || '',
        },
        scores: {
          careerScore: result.scores.careerScore,
          degreeScore: result.scores.degreeScore,
          upskillScore: result.scores.upskillScore,
        },
        primaryPersona: result.primaryPathway.id,
        recommendedPrograms: result.topRecommendedPrograms.map((p) => ({
          rank: p.rank,
          schoolCode: p.schoolCode,
          schoolName: p.schoolName,
          programId: p.programId,
          programName: p.programName,
          trackName: p.trackName || null,
          majorName: p.majorName || null,
          recommendationScore: p.recommendationScore,
        })),
      };

      // Save anonymous session record to Firestore
      saveQuizSession(payload);
    }
  };

  // Back to previous question in Quiz
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigateTo('welcome');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Restart Quiz: ONLY here do we clear the sessionStorage key
  const handleRestart = () => {
    try {
      trackEvent('quiz_restarted', {});
    } catch {
      // Ignore
    }
    clearQuizResultSession();
    setAnswers({});
    setCurrentStep(0);
    setScoringResult(null);
    navigateTo('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open advisory request view
  const handleOpenAdvisory = () => {
    navigateTo('advisory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to results from advisory view
  const handleBackToResults = () => {
    if (scoringResult) {
      navigateTo('results');
    } else {
      navigateTo('welcome');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F9F5] text-slate-800 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#00381D]">
      {/* Header */}
      {currentView !== 'admin' && (
        <Header currentView={currentView} onRestart={handleRestart} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start">
        {currentView === 'welcome' && (
          <Welcome onStartQuiz={handleStartQuiz} />
        )}

        {currentView === 'quiz' && (
          <Quiz
            questions={QUIZ_QUESTIONS}
            currentStep={currentStep}
            answers={answers}
            onSelectOption={handleSelectOption}
            onPrevStep={handlePrevStep}
            onRestart={handleRestart}
          />
        )}

        {currentView === 'results' && (
          <Results
            result={scoringResult}
            onRestart={handleRestart}
            onOpenAdvisory={handleOpenAdvisory}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {currentView === 'advisory' && (
          <PrivacyNotice
            scoringResult={scoringResult}
            onBackToResults={handleBackToResults}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            onBackToApp={() => {
              navigateTo('welcome');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer across all views */}
      <Footer
        currentView={currentView}
        onOpenAdmin={() => {
          navigateTo('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToApp={() => {
          navigateTo('welcome');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
