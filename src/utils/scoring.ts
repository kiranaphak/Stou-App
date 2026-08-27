import { PROGRAMS } from '../data/programs';
import { QUIZ_QUESTIONS } from '../data/questions';
import { AnswerRecord, ProgramId, ScoredProgram } from '../types';

/**
 * Calculates rule-based scores for STOU programs based on 6 quiz answers.
 * Fully deterministic, verifiable, and runs purely on local memory.
 */
export function calculateQuizResults(answers: Record<number, string>): ScoredProgram[] {
  // Initialize scores map and reasons map
  const scores: Record<ProgramId, number> = {
    management: 0,
    economics: 0,
    law: 0,
    political_science: 0,
    health_science: 0,
    human_ecology: 0,
    education: 0,
    liberal_arts: 0,
    agriculture: 0,
    communication_arts: 0,
    science_tech: 0,
    nursing: 0,
  };

  const programReasons: Record<ProgramId, string[]> = {
    management: [],
    economics: [],
    law: [],
    political_science: [],
    health_science: [],
    human_ecology: [],
    education: [],
    liberal_arts: [],
    agriculture: [],
    communication_arts: [],
    science_tech: [],
    nursing: [],
  };

  // Traverse each question and aggregate scores
  QUIZ_QUESTIONS.forEach((question) => {
    const selectedOptionId = answers[question.id];
    if (!selectedOptionId) return;

    const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) return;

    Object.entries(selectedOption.weights).forEach(([progKey, weight]) => {
      const pId = progKey as ProgramId;
      if (typeof weight === 'number' && weight > 0) {
        scores[pId] = (scores[pId] || 0) + weight;
        if (selectedOption.reasonSnippet && !programReasons[pId].includes(selectedOption.reasonSnippet)) {
          programReasons[pId].push(selectedOption.reasonSnippet);
        }
      }
    });
  });

  // Calculate highest possible theoretical score for normalization (~24 pts)
  const maxPossibleScore = 24;

  // Convert to ScoredProgram list
  const scoredList: ScoredProgram[] = (Object.keys(PROGRAMS) as ProgramId[]).map((pId) => {
    const rawScore = scores[pId] || 0;
    // Normalized match percentage between 40% and 98%
    const calculatedPercentage = Math.min(
      98,
      Math.max(45, Math.round((rawScore / maxPossibleScore) * 100 + (rawScore > 0 ? 10 : 0)))
    );

    // Fallback reason if answers gave broad weights
    const fallbackReasons = [
      `สอดคล้องกับเป้าหมายการต่อยอดความรู้ใน ${PROGRAMS[pId].shortName}`,
      `เหมาะกับลักษณะงานและรูปแบบภารกิจที่คุณให้ความสำคัญ`,
    ];

    const finalReasons = programReasons[pId].length > 0 ? programReasons[pId] : fallbackReasons;

    return {
      program: PROGRAMS[pId],
      score: rawScore,
      rank: 1,
      matchPercentage: calculatedPercentage,
      reasons: finalReasons.slice(0, 3), // Top 3 reasons
    };
  });

  // Sort descending by score
  scoredList.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Tie-breaker: stable Thai alphabetical / ID order
    return a.program.shortName.localeCompare(b.program.shortName, 'th');
  });

  // Assign ranks
  return scoredList.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

/**
 * Format answer history into readable summary tags
 */
export function getAnsweredTags(answers: Record<number, string>): AnswerRecord[] {
  return Object.entries(answers).map(([qId, optId]) => ({
    questionId: Number(qId),
    optionId: optId,
  }));
}
