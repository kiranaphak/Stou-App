import { describe, it, expect } from 'vitest';
import { calculateQuizResult, calculateRawScores, determinePrimaryPersona } from './scoring';
import { UserAnswers } from '../types';
import { PROGRAMS_2569 } from '../data/programs2569';

describe('STOU 2569 Rule-based Scoring Engine Unit Tests', () => {
  // Test 1: Degree Persona
  it('Case 1: Student seeking degree should result in "นักสร้างโอกาสใหม่"', () => {
    const answers: UserAnswers = {
      lifeStage: 'student', // career: 0, degree: 3, upskill: 1
      learningGoal: 'degree', // career: 1, degree: 4, upskill: 0
      desiredOutcome: 'degree', // career: 2, degree: 4, upskill: 0
      interestArea: 'business',
      futureUse: 'job_security', // career: 2, degree: 3, upskill: 1
      learningFormat: 'bachelor', // career: 1, degree: 4, upskill: 0
    };

    const scores = calculateRawScores(answers);
    expect(scores.degreeScore).toBe(18);
    expect(scores.careerScore).toBe(6);
    expect(scores.upskillScore).toBe(2);

    const result = calculateQuizResult(answers);
    expect(result.primaryPathway.id).toBe('degree');
    expect(result.primaryPathway.name).toBe('นักสร้างโอกาสใหม่');
    expect(result.topRecommendedPrograms.length).toBe(3);
  });

  // Test 2: Career Growth Persona
  it('Case 2: Working professional aiming for promotion should result in "นักพัฒนาความก้าวหน้าในอาชีพ"', () => {
    const answers: UserAnswers = {
      lifeStage: 'working', // career: 3, degree: 1, upskill: 2
      learningGoal: 'career', // career: 4, degree: 0, upskill: 1
      desiredOutcome: 'degree', // career: 2, degree: 4, upskill: 0
      interestArea: 'technology',
      futureUse: 'career_growth', // career: 4, degree: 1, upskill: 1
      learningFormat: 'graduate', // career: 4, degree: 2, upskill: 1
    };

    const scores = calculateRawScores(answers);
    expect(scores.careerScore).toBe(17);
    expect(scores.degreeScore).toBe(8);
    expect(scores.upskillScore).toBe(5);

    const result = calculateQuizResult(answers);
    expect(result.primaryPathway.id).toBe('career');
    expect(result.primaryPathway.name).toBe('นักพัฒนาความก้าวหน้าในอาชีพ');
    expect(result.topRecommendedPrograms[0].schoolCode).toBe('school_sci_tech');
  });

  // Test 3: Upskill / Reskill Persona
  it('Case 3: Practical skills & certificate seeker should result in "นัก Upskill / Reskill"', () => {
    const answers: UserAnswers = {
      lifeStage: 'entrepreneur', // career: 3, degree: 0, upskill: 2
      learningGoal: 'specific_skill', // career: 1, degree: 0, upskill: 4
      desiredOutcome: 'practical_skill', // career: 1, degree: 0, upskill: 4
      interestArea: 'agriculture',
      futureUse: 'digital_portfolio', // career: 2, degree: 0, upskill: 4
      learningFormat: 'certificate', // career: 1, degree: 1, upskill: 4
    };

    const scores = calculateRawScores(answers);
    expect(scores.upskillScore).toBe(18);
    expect(scores.careerScore).toBe(8);
    expect(scores.degreeScore).toBe(1);

    const result = calculateQuizResult(answers);
    expect(result.primaryPathway.id).toBe('upskill');
    expect(result.primaryPathway.name).toBe('นัก Upskill / Reskill');
    expect(result.topRecommendedPrograms[0].schoolCode).toBe('school_agriculture');
  });

  // Test 4: Tie breaker for degreeScore
  it('Case 4: Tie breaker selects degree when user chose goal or outcome as degree', () => {
    const answers: UserAnswers = {
      lifeStage: 'student',
      learningGoal: 'degree',
      desiredOutcome: 'explore',
      interestArea: 'law_society',
      futureUse: 'job_security',
      learningFormat: 'explore',
    };

    const tiedScores = { careerScore: 10, degreeScore: 10, upskillScore: 5 };
    const persona = determinePrimaryPersona(tiedScores, answers);
    expect(persona).toBe('degree');
  });

  // Test 5: Tie breaker for upskillScore
  it('Case 5: Tie breaker selects upskill when user chose practical_skill or certificate', () => {
    const answers: UserAnswers = {
      lifeStage: 'transition',
      learningGoal: 'career_change',
      desiredOutcome: 'practical_skill',
      interestArea: 'communication',
      futureUse: 'new_career',
      learningFormat: 'certificate',
    };

    const tiedScores = { careerScore: 5, degreeScore: 10, upskillScore: 10 };
    const persona = determinePrimaryPersona(tiedScores, answers);
    expect(persona).toBe('upskill');
  });

  // Test 6: Law & Society Interest Area Matching
  it('Case 6: Law & Society interest recommends School of Law and School of Political Science', () => {
    const answers: UserAnswers = {
      lifeStage: 'working',
      learningGoal: 'degree',
      desiredOutcome: 'degree',
      interestArea: 'law_society',
      futureUse: 'job_security',
      learningFormat: 'bachelor',
    };

    const result = calculateQuizResult(answers);
    const schoolCodes = result.topRecommendedPrograms.map((p) => p.schoolCode);
    expect(schoolCodes).toContain('school_law');
    expect(schoolCodes).toContain('school_political_sci');
  });

  // Test 7: Program Database Integrity
  it('Case 7: Verifies all 11 Schools exist in PROGRAMS_2569', () => {
    const schools = new Set(PROGRAMS_2569.map((p) => p.schoolCode));
    expect(schools.size).toBe(11);
    expect(schools.has('school_liberal_arts')).toBe(true);
    expect(schools.has('school_comm_arts')).toBe(true);
    expect(schools.has('school_education')).toBe(true);
    expect(schools.has('school_management')).toBe(true);
    expect(schools.has('school_law')).toBe(true);
    expect(schools.has('school_health')).toBe(true);
    expect(schools.has('school_economics')).toBe(true);
    expect(schools.has('school_human_ecology')).toBe(true);
    expect(schools.has('school_political_sci')).toBe(true);
    expect(schools.has('school_agriculture')).toBe(true);
    expect(schools.has('school_sci_tech')).toBe(true);
  });
});
