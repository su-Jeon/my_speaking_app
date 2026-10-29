export type RoundId = 1 | 2 | 3;

export interface DialogueStep {
  id: number;
  partnerLine: string;
  partnerLineKo: string;
  targetSentence: string;
  targetSentenceKo: string;
  keyWords: string[];
  smallKeywords?: string[]; // e.g. ["the", "is"]
  blanksSentence: string;
  blankWords: string[];
  recastFeedback: {
    en: string;
    ko: string;
  };
  elicitationFeedback: {
    en: string;
    ko: string;
  };
  chunkingFeedback: {
    en: string;
    ko: string;
  };
  smallWordMissingFeedback?: {
    en: string;
    ko: string;
  };
  successFeedback: {
    en: string;
    ko: string;
  };
}

export type FeedbackLevel = '🟢 잘 들렸어요!' | '🟡 거의 다 왔어요!' | '🟡 한 번 더 해 볼까요?';

export interface EvaluationResult {
  status: 'success' | 'almost' | 'retry';
  label: FeedbackLevel;
  feedbackEn: string;
  feedbackKo: string;
  recognizedText: string;
  missingKeyWords: string[];
  attemptNumber: number;
}

export interface StepRecord {
  stepId: number;
  status: 'completed' | 'skipped';
  attempts: number;
  recognizedText: string;
}
