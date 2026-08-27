export type ProgramId =
  | 'management'
  | 'economics'
  | 'law'
  | 'political_science'
  | 'health_science'
  | 'human_ecology'
  | 'education'
  | 'liberal_arts'
  | 'agriculture'
  | 'communication_arts'
  | 'science_tech'
  | 'nursing';

export interface Program {
  id: ProgramId;
  name: string;
  shortName: string;
  englishName: string;
  description: string;
  highlightMajors: string[];
  careerPaths: string[];
  iconName: string;
  badgeText: string;
  catalogUrl: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  subtext?: string;
  iconName?: string;
  weights: Partial<Record<ProgramId, number>>;
  reasonSnippet: string; // Explanatory reason when chosen
}

export interface Question {
  id: number;
  numberText: string;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
}

export interface AnswerRecord {
  questionId: number;
  optionId: string;
}

export interface ScoredProgram {
  program: Program;
  score: number;
  rank: number;
  matchPercentage: number;
  reasons: string[];
}

export interface ConsultationFormData {
  fullName: string;
  contactType: 'phone' | 'line' | 'email';
  contactValue: string;
  selectedPrograms: string[];
  studyBackground?: string;
  convenientTime?: string;
  inquiryNote?: string;
  consentInfo: boolean;
  consentNews: boolean;
}

export interface LeadSubmissionPayload {
  lead_id?: string;
  created_at?: string;
  event_name?: string;
  source_qr?: string;
  quiz_recommendations?: string;
  full_name: string;
  contact_type: 'phone' | 'line' | 'email';
  contact_value: string;
  interest_topics?: string;
  contact_request?: string;
  consent_info: boolean;
  consent_news?: boolean;
  privacy_version?: string;
}

export interface LeadSubmissionResponse {
  success: boolean;
  lead_id?: string;
  message?: string;
  error?: string;
}
