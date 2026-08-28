import { QUIZ_QUESTIONS } from '../data/questions';
import { PATHWAYS } from '../data/pathways';
import { PROGRAMS_2569, Program2569Item, Program2569MajorTrack } from '../data/programs2569';
import { getCareerPathsForProgram } from '../data/careerPaths';
import {
  PathwayId,
  RecommendedProgramResult,
  ScoreWeights,
  ScoringResult,
  UserAnswers,
} from '../types';

/**
 * Calculates raw score weights from user answers for Q1, Q2, Q3, Q5, Q6.
 */
export function calculateRawScores(answers: UserAnswers): ScoreWeights {
  const scores: ScoreWeights = {
    careerScore: 0,
    degreeScore: 0,
    upskillScore: 0,
  };

  // Helper to extract option scores
  const addOptionScore = (questionIndex: number, optionId?: string) => {
    if (!optionId) return;
    const q = QUIZ_QUESTIONS[questionIndex];
    if (!q) return;
    const opt = q.options.find((o) => o.id === optionId);
    if (opt) {
      scores.careerScore += opt.scores.careerScore;
      scores.degreeScore += opt.scores.degreeScore;
      scores.upskillScore += opt.scores.upskillScore;
    }
  };

  // Q1: lifeStage
  addOptionScore(0, answers.lifeStage || answers.q1_stage);
  // Q2: learningGoal
  addOptionScore(1, answers.learningGoal || answers.q2_education);
  // Q3: desiredOutcome
  addOptionScore(2, answers.desiredOutcome || answers.q3_hours);
  // Q4: interestArea (no raw career/degree/upskill score, used for curriculum matching)
  // Q5: futureUse
  addOptionScore(4, answers.futureUse || answers.q5_outcome);
  // Q6: learningFormat
  addOptionScore(5, answers.learningFormat || answers.q6_interest);

  return scores;
}

/**
 * Determines primary persona based on scores and tie-breaking rules.
 */
export function determinePrimaryPersona(scores: ScoreWeights, answers: UserAnswers): PathwayId {
  const { careerScore, degreeScore, upskillScore } = scores;
  const maxScore = Math.max(careerScore, degreeScore, upskillScore);

  const isCareerMax = careerScore === maxScore;
  const isDegreeMax = degreeScore === maxScore;
  const isUpskillMax = upskillScore === maxScore;

  // Single clear winner
  if (isCareerMax && !isDegreeMax && !isUpskillMax) return 'career';
  if (isDegreeMax && !isCareerMax && !isUpskillMax) return 'degree';
  if (isUpskillMax && !isCareerMax && !isDegreeMax) return 'upskill';

  // Tie-breaker conditions from specification:
  // 1. If degreeScore equals maxScore -> choose degree if Q2 == 'degree' OR Q3 == 'degree'
  const q2 = answers.learningGoal || answers.q2_education;
  const q3 = answers.desiredOutcome || answers.q3_hours;
  if (isDegreeMax && (q2 === 'degree' || q3 === 'degree')) {
    return 'degree';
  }

  // 2. If upskillScore equals maxScore -> choose upskill if Q3 == 'certificate' OR Q3 == 'practical_skill'
  if (isUpskillMax && (q3 === 'certificate' || q3 === 'practical_skill')) {
    return 'upskill';
  }

  // 3. Default fallback: careerScore wins ties
  if (isCareerMax) return 'career';
  if (isDegreeMax) return 'degree';
  return 'upskill';
}

/**
 * Generates tailored, 1-2 sentence recommendation reasons based on user responses.
 */
function buildRecommendationReason(
  program: Program2569Item,
  matchedMajors: Program2569MajorTrack[],
  answers: UserAnswers,
  persona: PathwayId
): string[] {
  const interest = answers.interestArea || 'business';
  const future = answers.futureUse || 'career_growth';

  const reasons: string[] = [];

  // Sentence 1: Connection to primary interest
  if (interest === 'business') {
    reasons.push('สอดคล้องกับความสนใจด้านการบริหารธุรกิจ การวางแผน และการขับเคลื่อนองค์กร');
  } else if (interest === 'law_society') {
    reasons.push('ตรงกับความสนใจด้านกฎหมาย นโยบายสาธารณะ และโครงสร้างสังคม');
  } else if (interest === 'communication') {
    reasons.push('เหมาะกับความชอบด้านการสื่อสาร สื่อดิจิทัล และการถ่ายทอดเนื้อหา');
  } else if (interest === 'people') {
    reasons.push('ตอบโจทย์ความสนใจในการดูแลผู้คน การศึกษา และการพัฒนาศักยภาพมนุษย์');
  } else if (interest === 'health') {
    reasons.push('ตรงกับความสนใจด้านการส่งเสริมสุขภาพ สุขาภิบาลชุมชน และคุณภาพชีวิต');
  } else if (interest === 'agriculture') {
    reasons.push('ตอบรับความต้องการพัฒนาการเกษตร สิ่งแวดล้อม และเศรษฐกิจชุมชน');
  } else if (interest === 'technology') {
    reasons.push('เหมาะสำหรับผู้สนใจนวัตกรรมดิจิทัล ข้อมูล และระบบเทคโนโลยีสมัยใหม่');
  } else {
    reasons.push('เนื้อหาครอบคลุมองค์ความรู้ที่ตรงกับเป้าหมายการเรียนรู้ที่คุณเลือก');
  }

  // Sentence 2: Persona and future use context
  if (future === 'digital_portfolio') {
    reasons.push('ช่วยสร้างผลงานและทักษะเฉพาะตัวในยุคดิจิทัลได้อย่างเป็นรูปธรรม');
  } else if (future === 'career_growth' || persona === 'career') {
    reasons.push('ช่วยยกระดับความเชี่ยวชาญและเปิดโอกาสความก้าวหน้าในสายงาน');
  } else if (future === 'community') {
    reasons.push('สามารถนำองค์ความรู้ไปประยุกต์ใช้เพื่อพัฒนาชุมชนและสังคมรอบตัว');
  } else if (future === 'new_career') {
    reasons.push('ปูพื้นฐานสำคัญสำหรับการริเริ่มธุรกิจใหม่หรือการเปลี่ยนสายงาน');
  } else {
    reasons.push('เปิดโอกาสในการต่อยอดวุฒิการศึกษาและทักษะที่นำไปใช้ได้จริง');
  }

  return reasons;
}

/**
 * Recommends top 3 programs based on Section D & E rules.
 */
export function calculateRecommendedPrograms(
  answers: UserAnswers,
  primaryPersona: PathwayId
): RecommendedProgramResult[] {
  const interest = answers.interestArea || 'business';
  const future = answers.futureUse || 'career_growth';
  const goal = answers.learningGoal || 'degree';
  const format = answers.learningFormat || 'bachelor';

  // Primary School priority based on Q4 Interest
  const primarySchoolPriority: Record<string, { primary: string[]; secondary: string[] }> = {
    law_society: {
      primary: ['school_law', 'school_political_sci'],
      secondary: ['school_liberal_arts', 'school_management'],
    },
    business: {
      primary: ['school_management', 'school_economics'],
      secondary: ['school_comm_arts', 'school_agriculture'],
    },
    communication: {
      primary: ['school_liberal_arts', 'school_comm_arts'],
      secondary: ['school_education', 'school_management'],
    },
    people: {
      primary: ['school_education', 'school_human_ecology', 'school_health'],
      secondary: ['school_liberal_arts', 'school_political_sci'],
    },
    health: {
      primary: ['school_health', 'school_human_ecology'],
      secondary: ['school_education', 'school_agriculture'],
    },
    agriculture: {
      primary: ['school_agriculture'],
      secondary: ['school_sci_tech', 'school_human_ecology'],
    },
    technology: {
      primary: ['school_sci_tech'],
      secondary: ['school_comm_arts', 'school_liberal_arts', 'school_management'],
    },
  };

  const schoolMapping = primarySchoolPriority[interest] || {
    primary: ['school_management', 'school_economics'],
    secondary: ['school_comm_arts'],
  };

  // Score each program and its majors
  const scoredPrograms = PROGRAMS_2569.map((prog) => {
    let programScore = 0;

    // 1. Primary school match bonus
    if (schoolMapping.primary.includes(prog.schoolCode)) {
      programScore += 100;
      if (schoolMapping.primary[0] === prog.schoolCode) {
        programScore += 25;
      }
    } else if (schoolMapping.secondary.includes(prog.schoolCode)) {
      programScore += 45;
    } else {
      programScore += 10;
    }

    // 2. Score individual majors/tracks inside the program
    const scoredMajors = prog.majorsAndTracks.map((major) => {
      let majorScore = 0;

      // Tag matching
      if (major.tags.includes(interest)) majorScore += 15;
      if (major.tags.includes(future)) majorScore += 12;
      if (major.tags.includes(goal)) majorScore += 8;

      // Keywords in tags
      prog.tags.forEach((tag) => {
        if (major.tags.includes(tag)) majorScore += 4;
      });

      return {
        major,
        score: majorScore,
      };
    });

    // Sort majors by relevance
    scoredMajors.sort((a, b) => b.score - a.score);
    const topMajors = scoredMajors.slice(0, 3).map((m) => m.major);

    // Sum top major scores into program score
    const bestMajorScores = scoredMajors.slice(0, 3).reduce((acc, curr) => acc + curr.score, 0);
    programScore += bestMajorScores;

    // 3. Format/Persona weight
    if (format === 'bachelor' || primaryPersona === 'degree') {
      programScore += 10;
    }
    if (future === 'digital_portfolio' && prog.schoolCode === 'school_sci_tech') {
      programScore += 30;
    }
    if (future === 'digital_portfolio' && prog.schoolCode === 'school_comm_arts') {
      programScore += 25;
    }
    if (future === 'job_security' && (prog.schoolCode === 'school_law' || prog.schoolCode === 'school_health')) {
      programScore += 20;
    }
    if (future === 'community' && (prog.schoolCode === 'school_agriculture' || prog.schoolCode === 'school_education')) {
      programScore += 20;
    }

    return {
      program: prog,
      score: programScore,
      topMajors,
    };
  });

  // Sort programs by score
  scoredPrograms.sort((a, b) => b.score - a.score);

  // Pick top 3 with school diversity requirement (at least 2 different schools unless score gap is huge)
  const selected: typeof scoredPrograms = [];
  const selectedSchools = new Set<string>();

  for (const candidate of scoredPrograms) {
    if (selected.length === 0) {
      selected.push(candidate);
      selectedSchools.add(candidate.program.schoolCode);
    } else if (selected.length === 1) {
      // Prefer different school if score is reasonably close
      if (!selectedSchools.has(candidate.program.schoolCode) || candidate.score >= selected[0].score - 15) {
        selected.push(candidate);
        selectedSchools.add(candidate.program.schoolCode);
      }
    } else if (selected.length === 2) {
      // For 3rd slot, ensure diversity if only 1 school so far
      if (selectedSchools.size === 1 && !selectedSchools.has(candidate.program.schoolCode)) {
        selected.push(candidate);
        selectedSchools.add(candidate.program.schoolCode);
      } else if (selectedSchools.size >= 2) {
        selected.push(candidate);
      }
    }

    if (selected.length === 3) break;
  }

  // Fallback if not reached 3
  if (selected.length < 3) {
    for (const candidate of scoredPrograms) {
      if (!selected.includes(candidate)) {
        selected.push(candidate);
      }
      if (selected.length === 3) break;
    }
  }

  // Format into final response
  return selected.slice(0, 3).map((item, index) => {
    const matchedMajorsFormatted = item.topMajors.map((m) => ({
      id: m.id,
      name: m.name,
      trackName: m.trackName,
      description: m.description,
    }));

    const fitReasons = buildRecommendationReason(
      item.program,
      item.topMajors,
      answers,
      primaryPersona
    );

    const matchedMajorNames = item.topMajors.map((m) => m.name);
    const careerInfo = getCareerPathsForProgram(
      item.program.schoolCode,
      item.program.programName,
      matchedMajorNames
    );

    return {
      rank: index + 1,
      schoolCode: item.program.schoolCode,
      schoolName: item.program.schoolName,
      programId: item.program.programId,
      programName: item.program.programName,
      degreeName: item.program.degreeName,
      trackName: item.topMajors[0]?.trackName || null,
      majorName: item.topMajors[0]?.name || null,
      recommendationScore: item.score,
      matchedMajors: matchedMajorsFormatted,
      fitReasons,
      careerPaths: careerInfo.primaryChips,
      allCareerPaths: careerInfo.allCareers,
      careerNotes: careerInfo.notes,
      detailUrl: item.program.detailUrl,
      iconName: item.program.iconName,
    };
  });
}

/**
 * Main calculation entry point.
 */
export function calculateQuizResult(answers: UserAnswers): ScoringResult {
  const scores = calculateRawScores(answers);
  const primaryId = determinePrimaryPersona(scores, answers);

  const allPathwayScores = [
    { pathway: PATHWAYS.career, score: scores.careerScore, rank: 0 },
    { pathway: PATHWAYS.degree, score: scores.degreeScore, rank: 0 },
    { pathway: PATHWAYS.upskill, score: scores.upskillScore, rank: 0 },
  ];

  // Sort and assign ranks
  allPathwayScores.sort((a, b) => {
    if (a.pathway.id === primaryId) return -1;
    if (b.pathway.id === primaryId) return 1;
    return b.score - a.score;
  });

  allPathwayScores.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  const topRecommendedPrograms = calculateRecommendedPrograms(answers, primaryId);

  // Interest label lookup
  const q4Question = QUIZ_QUESTIONS[3];
  const selectedQ4 = q4Question.options.find(
    (o) => o.id === (answers.interestArea || answers.q6_interest)
  );
  const interestLabel = selectedQ4 ? selectedQ4.label : 'ธุรกิจ การบริหาร ตัวเลข และการวางแผน';

  return {
    primaryPathway: PATHWAYS[primaryId],
    allPathwayScores,
    scores,
    topRecommendedPrograms,
    answers,
    primaryPersonaKey: primaryId,
    interestLabel,
  };
}
