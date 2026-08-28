export type PathwayId = 'career' | 'degree' | 'upskill';
export type ProgramId = string;

export interface ScoreWeights {
  careerScore: number;
  degreeScore: number;
  upskillScore: number;
}

export interface QuizOption {
  id: string;
  label: string;
  sublabel?: string;
  scores: ScoreWeights;
  iconName?: string;
}

export interface QuizQuestion {
  id: number;
  numberText: string;
  title: string;
  subtitle?: string;
  options: QuizOption[];
}

export interface PathwayResult {
  id: PathwayId;
  name: string;
  tagline: string;
  targetAudience: string;
  description: string;
  recommendedPaths: string[];
  iconName: string;
  badgeText: string;
  ctaText: string;
}

export interface MatchedMajorInfo {
  id: string;
  name: string;
  trackName?: string;
  description?: string;
}

export interface CareerPathDetail {
  title: string;
  description: string;
  note?: string;
}

export interface RecommendedProgramResult {
  rank: number;
  schoolCode: string;
  schoolName: string;
  programId: string;
  programName: string;
  degreeName: string;
  trackName?: string | null;
  majorName?: string | null;
  recommendationScore: number;
  matchedMajors: MatchedMajorInfo[];
  fitReasons: string[];
  careerPaths: string[];
  careerPathDetails?: CareerPathDetail[];
  allCareerPaths?: string[];
  careerNotes?: string[];
  detailUrl: string;
  iconName: string;
}

export interface ScoringResult {
  primaryPathway: PathwayResult;
  allPathwayScores: {
    pathway: PathwayResult;
    score: number;
    rank: number;
  }[];
  scores: ScoreWeights;
  topRecommendedPrograms: RecommendedProgramResult[];
  answers: UserAnswers;
  primaryPersonaKey: PathwayId;
  interestLabel: string;
  // Backward compatibility
  matchedFields?: FieldOfStudy[];
  canAccessGraduate?: boolean;
  selectedInterest?: string;
}

export interface UserAnswers {
  lifeStage?: string; // Q1: student | working | entrepreneur | transition | lifelong
  learningGoal?: string; // Q2: degree | career | career_change | specific_skill | personal
  desiredOutcome?: string; // Q3: degree | certificate | practical_skill | explore
  interestArea?: string; // Q4: people | business | law_society | communication | health | agriculture | technology
  futureUse?: string; // Q5: career_growth | new_career | job_security | community | digital_portfolio
  learningFormat?: string; // Q6: bachelor | graduate | certificate | explore

  // Legacy field support
  q1_stage?: string;
  q2_education?: string;
  q3_hours?: string;
  q4_goal?: string;
  q5_outcome?: string;
  q6_interest?: string;
}

export interface FieldOfStudy {
  id: string;
  name: string;
  englishName: string;
  description: string;
  highlightPrograms: string;
  careerOpportunities: string;
  iconName: string;
  url: string;
}

export interface Program {
  id: string;
  name: string;
  shortName?: string;
  englishName: string;
  degreeLevel?: string;
  description: string;
  suitableFor?: string;
  duration?: string;
  admissionRequirements?: string;
  iconName: string;
  features?: string[];
  highlightTag?: string;
  highlightMajors?: string[];
  careerPaths?: string[];
  badgeText?: string;
  catalogUrl?: string;
  targetCareer?: string;
  url?: string;
}

export interface ConsultationFormData {
  name: string;
  phone: string;
  lineId?: string;
  interestField: string;
  preferredPathway: string;
  note?: string;
  consentAgreed: boolean;
}

export interface LeadSubmissionResponse {
  success: boolean;
  message: string;
  leadId?: string;
  error?: string;
}

export interface AnonymousQuizSessionPayload {
  sessionId: string;
  completedAt: any;
  appVersion: string;
  answers: {
    lifeStage: string;
    learningGoal: string;
    desiredOutcome: string;
    interestArea: string;
    futureUse: string;
    learningFormat: string;
  };
  scores: {
    careerScore: number;
    degreeScore: number;
    upskillScore: number;
  };
  primaryPersona: string;
  recommendedPrograms: {
    rank: number;
    schoolCode: string;
    schoolName: string;
    programId: string;
    programName: string;
    trackName: string | null;
    majorName: string | null;
    recommendationScore: number;
  }[];
}
