import React, { useState, useEffect } from 'react';
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
  getOrCreateSessionId,
  generateUniqueQuizAttemptId,
  APP_VERSION,
} from './lib/firebase';
import { Shield, BarChart2 } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<'welcome' | 'quiz' | 'results' | 'advisory' | 'admin'>('welcome');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);

  // Check URL query parameters for ?admin=true or ?view=admin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('view') === 'admin') {
        setCurrentView('admin');
      }
    }
    // Track initial page view
    trackEvent('quiz_viewed', {});
  }, []);

  // Start Quiz
  const handleStartQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setScoringResult(null);
    setCurrentView('quiz');
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
    trackEvent('quiz_question_answered', {
      question_number: questionId,
      answer_key: optionId,
    });

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed all 6 questions - Calculate result
      const result = calculateQuizResult(updatedAnswers);
      setScoringResult(result);
      setCurrentView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Build anonymous payload for Firestore and analytics
      const sessionId = generateUniqueQuizAttemptId();
      const topProg = result.topRecommendedPrograms[0];

      trackEvent('quiz_completed', {
        persona: result.primaryPathway.id,
        top_school_code: topProg?.schoolCode || '',
        top_program_id: topProg?.programId || '',
        interest_area: updatedAnswers.interestArea || '',
      });

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

      // Save anonymous session record
      saveQuizSession(payload);
    }
  };

  // Back to previous question in Quiz
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('welcome');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Restart Quiz from anywhere
  const handleRestart = () => {
    trackEvent('quiz_restarted', {});
    setAnswers({});
    setCurrentStep(0);
    setScoringResult(null);
    setCurrentView('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open advisory request view
  const handleOpenAdvisory = () => {
    setCurrentView('advisory');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to results from advisory view
  const handleBackToResults = () => {
    if (scoringResult) {
      setCurrentView('results');
    } else {
      setCurrentView('welcome');
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

        {currentView === 'results' && scoringResult && (
          <Results
            result={scoringResult}
            onRestart={handleRestart}
            onOpenAdvisory={handleOpenAdvisory}
          />
        )}

        {currentView === 'advisory' && (
          <PrivacyNotice
            scoringResult={scoringResult}
            onBackToResults={handleBackToResults}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onBackToApp={handleRestart} />
        )}
      </main>

      {/* Footer across all views */}
      <Footer
        currentView={currentView}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToApp={handleRestart}
      />
    </div>
  );
}

export default App;
