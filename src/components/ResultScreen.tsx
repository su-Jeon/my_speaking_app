import React, { useEffect } from 'react';
import { RoundId, StepRecord } from '../types';
import { DIALOGUE_STEPS } from '../data/dialogue';
import { SimpleDrawnMap } from './SimpleDrawnMap';
import { LeoCharacter } from './LeoCharacter';
import { soundManager } from '../utils/audio';
import {
  RotateCcw,
  Home,
  CheckCircle,
  SkipForward,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react';

interface ResultScreenProps {
  currentRound: RoundId;
  records: StepRecord[];
  previousStars: number | null;
  onNextRound: () => void;
  onPracticeAgain: () => void;
  onGoHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  currentRound,
  records,
  previousStars,
  onNextRound,
  onPracticeAgain,
  onGoHome,
}) => {
  // Calculate stars based on PRD Section 6 rules:
  // - 0 skips: ⭐⭐⭐ Finished all 5 sentences without skipping
  // - 1-2 skips: ⭐⭐ Finished the dialogue with 1–2 skips
  // - 3+ skips: ⭐ Finished the whole dialogue
  const skipCount = records.filter((r) => r.status === 'skipped').length;
  let earnedStars = 3;
  if (skipCount === 0) {
    earnedStars = 3;
  } else if (skipCount <= 2) {
    earnedStars = 2;
  } else {
    earnedStars = 1;
  }

  // Play celebration sound on mount
  useEffect(() => {
    soundManager.playChime('star');
  }, []);

  // Wrap-up text based on Round and performance
  const getWellDoneNote = () => {
    if (earnedStars === 3) {
      return '길을 묻고 확인하는 핵심 표현을 모두 자신 있게 소리 내어 말했어요!';
    }
    return '길을 다시 확인하는 질문을 끝까지 포기하지 않고 잘 시도했어요!';
  };

  const getNextChallengeNote = () => {
    if (currentRound === 1) {
      return '다음 도전: Round 2(빈칸 말하기)에서 핵심 단어를 직접 떠올려 말해 봐요.';
    } else if (currentRound === 2) {
      return '다음 도전: Round 3(혼자 말하기)에서 힌트 없이 우리말 뜻만 보고 말해 봐요!';
    } else {
      return '최고 단계 완료! 실제 여행지에서도 Leo에게 물어보듯 외국인에게 자신 있게 질문해 보세요.';
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto px-4 py-6 justify-between select-none">
      {/* Top Section: Goal Celebration & Stars */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span>지하철역 도착 성공! (Goal Reached)</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          You found the way!
        </h1>
        <p className="text-sm font-bold text-emerald-700">
          Leo의 친절한 안내를 받아 지하철역을 잘 찾았어요!
        </p>

        {/* Stars Display (Completion based, no % score) */}
        <div className="flex items-center justify-center gap-2 py-1">
          {[1, 2, 3].map((starIdx) => {
            const isFilled = starIdx <= earnedStars;
            return (
              <div
                key={starIdx}
                className="transform transition-transform duration-300 hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    isFilled
                      ? 'fill-amber-400 text-amber-500 drop-shadow-md animate-bounce'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                  style={{ animationDelay: `${starIdx * 150}ms` }}
                />
              </div>
            );
          })}
        </div>

        {/* Star rules note */}
        <p className="text-xs font-semibold text-slate-500">
          {earnedStars === 3
            ? '⭐⭐⭐ 5개 문장을 모두 건너뛰기 없이 완료했어요!'
            : earnedStars === 2
            ? '⭐⭐ 질문을 잘 마쳤어요! (1~2개 건너뜀)'
            : '⭐ 지하철역까지 모든 대화를 끝까지 완주했어요!'}
        </p>

        {/* Finished Map with Leo celebrating */}
        <div className="relative">
          <SimpleDrawnMap
            currentStepIndex={4}
            completedSteps={[1, 2, 3, 4, 5]}
            isFinished={true}
            className="w-full"
          />
          <div className="absolute right-3 -bottom-3">
            <LeoCharacter mood="celebrating" size="sm" />
          </div>
        </div>
      </div>

      {/* Middle Section: 5 Sentences Checklist & Leo Wrap-Up */}
      <div className="my-4 space-y-3">
        {/* Sentence Review List (Checklist only, strictly NO numbers or percentages) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>오늘 말해본 5개 표현 (Completed Expressions)</span>
            <span className="text-[11px] font-normal text-slate-400">점수가 아닌 완료 체크입니다</span>
          </h3>

          <div className="space-y-2">
            {DIALOGUE_STEPS.map((step) => {
              const record = records.find((r) => r.stepId === step.id);
              const isFinished = record?.status === 'completed';

              return (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-left"
                >
                  <div className="flex items-center gap-2 flex-1 pr-2">
                    <span className="shrink-0">
                      {isFinished ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <SkipForward className="w-4 h-4 text-amber-500" />
                      )}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        {step.targetSentence}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {step.targetSentenceKo}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                      isFinished
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isFinished ? '완료' : '건너뜀'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leo's Wrap-Up (Section 7: one thing well + one challenge in Korean) */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200 shadow-sm space-y-2 text-left">
          <div className="flex items-center gap-2">
            <LeoCharacter mood="happy" size="sm" />
            <div>
              <span className="text-xs font-black text-amber-900">
                Leo의 따뜻한 피드백 (Leo&apos;s Wrap-up)
              </span>
              <p className="text-[11px] text-slate-500">친구처럼 전하는 응원 한마디</p>
            </div>
          </div>

          <div className="text-xs text-slate-800 space-y-1.5 pt-1 pl-1">
            <p className="font-bold text-emerald-800">
              👏 잘한 점: <span className="font-medium text-slate-700">{getWellDoneNote()}</span>
            </p>
            <p className="font-bold text-blue-800">
              🎯 다음 도전: <span className="font-medium text-slate-700">{getNextChallengeNote()}</span>
            </p>
          </div>

          {/* Historical comparison with last try on this device */}
          <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">이 기기에서의 지난 기록:</span>
            <span className="font-bold text-amber-700">
              {previousStars !== null
                ? `Last time: ${'⭐'.repeat(previousStars)} → Today: ${'⭐'.repeat(earnedStars)}`
                : `Today: ${'⭐'.repeat(earnedStars)} (첫 도전 완료!)`}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Next Round, Practice Again, Home */}
      <div className="space-y-2">
        {currentRound < 3 && (
          <button
            type="button"
            onClick={() => {
              soundManager.playChime('step');
              onNextRound();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <span>▶ Next Round (Round {currentRound + 1} 더 적은 힌트로 도전!)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              soundManager.playChime('click');
              onPracticeAgain();
            }}
            className="flex-1 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>🔁 Practice Again (다시 연습하기)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundManager.playChime('click');
              onGoHome();
            }}
            className="flex-1 py-3 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>🏠 Home (처음으로)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
