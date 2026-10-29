import { DialogueStep, EvaluationResult } from '../types';

/**
 * Normalizes text for comparison:
 * - lowercase
 * - expands contractions (e.g., where's -> where is, it's -> it is, thanks -> thank)
 * - removes punctuation
 * - collapses whitespace
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/\bwhere's\b/g, 'where is')
    .replace(/\bit's\b/g, 'it is')
    .replace(/\bthat's\b/g, 'that is')
    .replace(/\bcan't\b/g, 'can not')
    .replace(/\bthanks\b/g, 'thank')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks if the student's text contains the required keywords.
 * Also checks for small function words like "the", "is", "at".
 */
export function evaluateUtterance(
  spokenText: string,
  step: DialogueStep,
  failureAttemptCount: number, // 0 for first failure, 1 for second failure, etc.
  consecutiveNoSpeechCount: number = 0
): EvaluationResult {
  const trimmed = spokenText.trim();

  // Case 1: Nothing heard / silent
  if (!trimmed) {
    if (consecutiveNoSpeechCount >= 2) {
      return {
        status: 'retry',
        label: '🟡 한 번 더 해 볼까요?',
        feedbackEn: "That's okay! You can type it, too.",
        feedbackKo: '괜찮아요! 글자로 입력해도 돼요.',
        recognizedText: '',
        missingKeyWords: step.keyWords,
        attemptNumber: failureAttemptCount + 1,
      };
    }
    return {
      status: 'retry',
      label: '🟡 한 번 더 해 볼까요?',
      feedbackEn: "I couldn't hear you. Let's try again!",
      feedbackKo: '소리가 안 들렸어요. 다시 해 볼까요?',
      recognizedText: '',
      missingKeyWords: step.keyWords,
      attemptNumber: failureAttemptCount + 1,
    };
  }

  const normalized = normalizeText(trimmed);
  const words = normalized.split(/\s+/);

  // Check key words presence
  const missingKeyWords = step.keyWords.filter((kw) => {
    const normKw = normalizeText(kw);
    return !words.some((w) => w === normKw || w.startsWith(normKw) || normKw.startsWith(w));
  });

  const hasAllKeywords = missingKeyWords.length === 0;

  if (hasAllKeywords) {
    // Check if small word is missing (e.g. dropping "the" in "Where is subway station?")
    if (step.smallKeywords && step.smallKeywords.length > 0) {
      const missingSmall = step.smallKeywords.filter((sw) => {
        const normSw = normalizeText(sw);
        return !words.includes(normSw);
      });

      if (missingSmall.length > 0 && step.smallWordMissingFeedback) {
        return {
          status: 'almost',
          label: '🟡 거의 다 왔어요!',
          feedbackEn: step.smallWordMissingFeedback.en,
          feedbackKo: step.smallWordMissingFeedback.ko,
          recognizedText: trimmed,
          missingKeyWords: [],
          attemptNumber: failureAttemptCount + 1,
        };
      }
    }

    // Success!
    return {
      status: 'success',
      label: '🟢 잘 들렸어요!',
      feedbackEn: step.successFeedback.en,
      feedbackKo: step.successFeedback.ko,
      recognizedText: trimmed,
      missingKeyWords: [],
      attemptNumber: failureAttemptCount + 1,
    };
  }

  // Key word missing:
  // 1st failure -> Recast
  // 2nd failure -> Elicitation (first letter hint)
  // 3rd failure or higher -> Chunking
  if (failureAttemptCount === 0) {
    return {
      status: 'retry',
      label: '🟡 한 번 더 해 볼까요?',
      feedbackEn: step.recastFeedback.en,
      feedbackKo: step.recastFeedback.ko,
      recognizedText: trimmed,
      missingKeyWords,
      attemptNumber: 1,
    };
  } else if (failureAttemptCount === 1) {
    return {
      status: 'retry',
      label: '🟡 한 번 더 해 볼까요?',
      feedbackEn: step.elicitationFeedback.en,
      feedbackKo: step.elicitationFeedback.ko,
      recognizedText: trimmed,
      missingKeyWords,
      attemptNumber: 2,
    };
  } else {
    return {
      status: 'retry',
      label: '🟡 한 번 더 해 볼까요?',
      feedbackEn: step.chunkingFeedback.en,
      feedbackKo: step.chunkingFeedback.ko,
      recognizedText: trimmed,
      missingKeyWords,
      attemptNumber: failureAttemptCount + 1,
    };
  }
}
