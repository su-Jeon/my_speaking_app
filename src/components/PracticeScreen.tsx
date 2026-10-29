import React, { useState, useEffect, useRef } from 'react';
import { DialogueStep, EvaluationResult, RoundId } from '../types';
import { SimpleDrawnMap } from './SimpleDrawnMap';
import { LeoCharacter } from './LeoCharacter';
import { soundManager } from '../utils/audio';
import { evaluateUtterance } from '../utils/evaluator';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import {
  Volume2,
  Turtle,
  Mic,
  RotateCcw,
  ArrowRight,
  SkipForward,
  Keyboard,
  Lightbulb,
  CheckCircle2,
  Radio,
  Send,
  HelpCircle,
} from 'lucide-react';

interface PracticeScreenProps {
  currentStep: DialogueStep;
  stepIndex: number; // 0 to 4
  totalSteps: number;
  currentRound: RoundId;
  completedSteps: number[];
  onCompleteStep: (stepId: number, recognizedText: string, attempts: number) => void;
  onSkipStep: (stepId: number) => void;
  onExitToHome: () => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  currentStep,
  stepIndex,
  totalSteps,
  currentRound,
  completedSteps,
  onCompleteStep,
  onSkipStep,
  onExitToHome,
}) => {
  // State
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [failureCount, setFailureCount] = useState<number>(0);
  const [consecutiveNoSpeech, setConsecutiveNoSpeech] = useState<number>(0);
  const [showTypeInput, setShowTypeInput] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>('');
  const [showRound3Hint, setShowRound3Hint] = useState<boolean>(false);
  const [stepFinished, setStepFinished] = useState<boolean>(false);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);

  // Play Leo's partner line once on step mount
  const hasSpokenPartnerRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset state for new step
    setEvaluation(null);
    setFailureCount(0);
    setConsecutiveNoSpeech(0);
    setShowTypeInput(false);
    setTypedText('');
    setShowRound3Hint(false);
    setStepFinished(false);
    setTotalAttempts(0);

    if (hasSpokenPartnerRef.current !== currentStep.id) {
      hasSpokenPartnerRef.current = currentStep.id;
      // Slight delay for smooth visual transition
      const timer = setTimeout(() => {
        playPartnerAudio();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [currentStep.id]);

  const playPartnerAudio = () => {
    setIsAudioPlaying(true);
    soundManager.speak(currentStep.partnerLine, {
      rate: 0.95,
      pitch: 1.05,
      onEnd: () => setIsAudioPlaying(false),
    });
  };

  const playTargetAudio = (rate: number = 0.95) => {
    setIsAudioPlaying(true);
    soundManager.speak(currentStep.targetSentence, {
      rate,
      pitch: 1.0,
      onEnd: () => setIsAudioPlaying(false),
    });
  };

  // Evaluation handler (from speech or typing)
  const handleProcessUtterance = (rawText: string) => {
    setTotalAttempts((prev) => prev + 1);

    const isSilent = !rawText.trim();
    const newNoSpeech = isSilent ? consecutiveNoSpeech + 1 : 0;
    setConsecutiveNoSpeech(newNoSpeech);

    const result = evaluateUtterance(
      rawText,
      currentStep,
      failureCount,
      newNoSpeech
    );

    setEvaluation(result);

    if (result.status === 'success' || result.status === 'almost') {
      // Plays cheerful chime
      soundManager.playChime(result.status === 'success' ? 'success' : 'almost');
      setStepFinished(true);
    } else {
      soundManager.playChime('retry');
      setFailureCount((prev) => prev + 1);
    }
  };

  // Speech Recognition Hook
  const {
    micState,
    transcript,
    setTranscript,
    isSupported,
    permissionError,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onTranscriptComplete: (heard) => {
      handleProcessUtterance(heard);
    },
    isAudioPlaying,
  });

  const handleMicClick = () => {
    if (isAudioPlaying) return;

    if (micState === 'listening') {
      stopListening();
    } else {
      soundManager.playChime('click');
      startListening();
    }
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedText.trim()) return;
    setTranscript(typedText);
    handleProcessUtterance(typedText);
    setTypedText('');
  };

  const handleNextStep = () => {
    soundManager.playChime('step');
    const spoken = evaluation?.recognizedText || currentStep.targetSentence;
    onCompleteStep(currentStep.id, spoken, totalAttempts);
  };

  const handleSkip = () => {
    soundManager.playChime('click');
    onSkipStep(currentStep.id);
  };

  const handleTryAgain = () => {
    soundManager.playChime('click');
    setEvaluation(null);
    setTranscript('');
  };

  // Round 3 logic: Model audio is accessible ONLY after tapping [💡 Hint]
  const isTargetAudioAllowed = currentRound !== 3 || showRound3Hint;

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto px-4 py-4 justify-between select-none">
      {/* Top Section: Progress & Drawn Map */}
      <div className="space-y-3">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onExitToHome}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-white/70 border border-slate-200 cursor-pointer"
          >
            ← 홈으로 (Exit)
          </button>

          {/* Round Tag */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              Round {currentRound} ·{' '}
              {currentRound === 1
                ? '따라 말하기'
                : currentRound === 2
                ? '빈칸 말하기'
                : '혼자 말하기'}
            </span>
            <span className="text-xs font-extrabold text-slate-700 bg-amber-100 px-2 py-0.5 rounded-full">
              {stepIndex + 1} / {totalSteps}
            </span>
          </div>
        </div>

        {/* Drawn Map with animated growing path */}
        <SimpleDrawnMap
          currentStepIndex={stepIndex}
          completedSteps={completedSteps}
          className="w-full"
        />

        {/* Leo's Line Speech Bubble */}
        <div className="flex items-start gap-3 bg-white rounded-2xl p-3.5 border-2 border-amber-200 shadow-sm relative">
          <div className="shrink-0 flex flex-col items-center">
            <LeoCharacter
              mood={isAudioPlaying ? 'speaking' : 'waving'}
              size="sm"
            />
            <span className="text-[10px] font-bold text-slate-500 mt-0.5">
              Leo
            </span>
          </div>

          <div className="flex-1 pr-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800">
                Leo의 말 (Listen)
              </span>
              <button
                type="button"
                onClick={playPartnerAudio}
                disabled={isAudioPlaying}
                title="다시 듣기"
                className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                  isAudioPlaying
                    ? 'bg-amber-100 border-amber-300 text-amber-900'
                    : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-600'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm font-bold text-slate-800 mt-1 leading-snug">
              &ldquo;{currentStep.partnerLine}&rdquo;
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentStep.partnerLineKo}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: Student Target Sentence */}
      <div className="my-3 flex flex-col items-center">
        <div className="w-full bg-white rounded-3xl p-5 border-2 border-blue-100 shadow-md text-center space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              내가 해야 할 말 (Your Turn)
            </span>

            {/* In Round 3, show Hint toggle button */}
            {currentRound === 3 && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playChime('hint');
                  setShowRound3Hint(true);
                }}
                className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-all ${
                  showRound3Hint
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-amber-500 text-white shadow-xs hover:bg-amber-600'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                {showRound3Hint ? '힌트 표시됨' : '💡 Hint (힌트 보기)'}
              </button>
            )}
          </div>

          {/* Target Sentence Display by Round Scaffolding */}
          <div className="py-2">
            {currentRound === 1 && (
              // Round 1: Full sentence is shown in bold largest text
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {currentStep.targetSentence}
              </h2>
            )}

            {currentRound === 2 && (
              // Round 2: Key words are blanks
              <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {currentStep.blanksSentence}
                </h2>
                {/* Keyword Cards Below Blanks */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-slate-500">
                    빈칸 단어 힌트:
                  </span>
                  {currentStep.blankWords.map((word) => (
                    <span
                      key={word}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentRound === 3 && (
              // Round 3: Only Korean meaning shown, unless Hint tapped
              <div className="space-y-3">
                {showRound3Hint ? (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      힌트: 빈칸 문장
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                      {currentStep.blanksSentence}
                    </h2>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-xs font-bold text-amber-700 mb-1">
                      영어로 어떻게 말할까요?
                    </p>
                    <p className="text-base text-slate-600 font-medium">
                      생각이 안 나면 우측 상단 <span className="font-bold text-amber-700">[💡 Hint]</span>를 눌러보세요!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Korean Meaning (always displayed) */}
            <p className="text-sm font-semibold text-blue-900/80 mt-2 bg-blue-50/70 py-1 px-3 rounded-xl inline-block">
              {currentStep.targetSentenceKo}
            </p>
          </div>

          {/* Model Audio Listen Buttons: [🔊 Listen] [🐢 Slow] */}
          <div className="flex items-center justify-center gap-3 pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => playTargetAudio(0.95)}
              disabled={isAudioPlaying || !isTargetAudioAllowed}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                !isTargetAudioAllowed
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                  : isAudioPlaying
                  ? 'bg-blue-100 border-blue-300 text-blue-900'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-2xs'
              }`}
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>🔊 Listen</span>
            </button>

            <button
              type="button"
              onClick={() => playTargetAudio(0.65)}
              disabled={isAudioPlaying || !isTargetAudioAllowed}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                !isTargetAudioAllowed
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                  : isAudioPlaying
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-2xs'
              }`}
            >
              <Turtle className="w-4 h-4 text-amber-600" />
              <span>🐢 Slow (느리게)</span>
            </button>
          </div>
          {currentRound === 3 && !showRound3Hint && (
            <p className="text-[11px] text-slate-400 italic">
              * Round 3에서는 [💡 Hint]를 눌러야 모델 음성을 들을 수 있어요.
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section: Mic Button, "I heard...", Feedback Box, and Controls */}
      <div className="space-y-3">
        {/* Permission / Support Notice if needed */}
        {permissionError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl text-xs flex items-center justify-between">
            <span>{permissionError}</span>
            <button
              type="button"
              onClick={() => setShowTypeInput(true)}
              className="font-bold underline ml-2 text-rose-900"
            >
              글자로 입력하기
            </button>
          </div>
        )}

        {!isSupported && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-xl text-xs flex items-center justify-between">
            <span>브라우저 음성 인식이 지원되지 않아 키보드 입력 모드를 지원합니다.</span>
            <button
              type="button"
              onClick={() => setShowTypeInput(true)}
              className="font-bold underline ml-2"
            >
              입력창 열기
            </button>
          </div>
        )}

        {/* Large Round Mic Button */}
        {!showTypeInput ? (
          <div className="flex flex-col items-center justify-center pt-1">
            <div className="relative">
              {/* Pulsing ring in listening state */}
              {micState === 'listening' && (
                <span className="absolute -inset-3 rounded-full bg-red-400 opacity-75 animate-ping" />
              )}

              <button
                type="button"
                onClick={handleMicClick}
                disabled={micState === 'disabled'}
                className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                  micState === 'disabled'
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none border-4 border-slate-200'
                    : micState === 'listening'
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/40 scale-105 border-4 border-white'
                    : micState === 'done'
                    ? 'bg-emerald-500 text-white shadow-emerald-500/40 border-4 border-white'
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-500/30 border-4 border-white'
                }`}
              >
                {micState === 'listening' ? (
                  <Mic className="w-9 h-9 animate-pulse" />
                ) : micState === 'done' ? (
                  <CheckCircle2 className="w-9 h-9 animate-bounce" />
                ) : micState === 'disabled' ? (
                  <Volume2 className="w-8 h-8 text-slate-500" />
                ) : (
                  <Mic className="w-9 h-9" />
                )}

                <span className="text-[11px] font-extrabold mt-1">
                  {micState === 'disabled'
                    ? '음성 재생 중'
                    : micState === 'listening'
                    ? 'Listening…'
                    : micState === 'done'
                    ? 'Done!'
                    : 'Tap to speak'}
                </span>
              </button>
            </div>

            <p className="text-xs font-semibold text-slate-500 mt-2">
              {micState === 'listening'
                ? '듣고 있어요… 말씀을 멈추면 1.5초 후 자동 완료됩니다.'
                : micState === 'disabled'
                ? '모델 음성이 끝난 후 마이크를 탭할 수 있어요.'
                : '마이크를 탭하고 소리 내어 말해보세요!'}
            </p>
          </div>
        ) : (
          /* Fallback / Choice Typing Box */
          <form
            onSubmit={handleTypeSubmit}
            className="bg-white p-3.5 rounded-2xl border-2 border-indigo-200 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
              <span className="flex items-center gap-1">
                <Keyboard className="w-3.5 h-3.5 text-indigo-600" /> 키보드로 입력하기 (Type it)
              </span>
              <button
                type="button"
                onClick={() => setShowTypeInput(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                마이크로 돌아가기
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="예: Yes, please. Where is the subway station?"
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <button
                type="submit"
                disabled={!typedText.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> 확인
              </button>
            </div>
          </form>
        )}

        {/* "I heard: …" Display */}
        {transcript && (
          <div className="bg-slate-100 rounded-xl px-3.5 py-2 border border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-500">I heard (내가 말한 내용): </span>
            <span className="text-xs font-black text-slate-800">&ldquo;{transcript}&rdquo;</span>
          </div>
        )}

        {/* Feedback Box with 3-Level Label */}
        {evaluation && (
          <div
            className={`rounded-2xl p-4 border-2 transition-all duration-300 shadow-sm ${
              evaluation.status === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : evaluation.status === 'almost'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-900'
            }`}
          >
            {/* 3-Level Label Tag */}
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full shadow-2xs ${
                  evaluation.status === 'success'
                    ? 'bg-emerald-600 text-white'
                    : evaluation.status === 'almost'
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {evaluation.label}
              </span>
              <span className="text-[11px] font-bold text-slate-500">Leo&apos;s Feedback</span>
            </div>

            {/* Leo's Advice (English + Korean in parentheses) */}
            <p className="text-sm font-black leading-snug">
              {evaluation.feedbackEn}
            </p>
            <p className="text-xs font-semibold text-slate-600 mt-1">
              ({evaluation.feedbackKo})
            </p>
          </div>
        )}

        {/* Appear [⌨️ Type it] button after 2 failed speech attempts or if stuck */}
        {(consecutiveNoSpeech >= 2 || failureCount >= 2) && !showTypeInput && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                soundManager.playChime('click');
                setShowTypeInput(true);
              }}
              className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>⌨️ Type it (직접 입력하기)</span>
            </button>
          </div>
        )}

        {/* Action Buttons: [Try Again] [Next →] [Skip] */}
        <div className="flex items-center gap-2 pt-1">
          {/* Try Again */}
          <button
            type="button"
            onClick={handleTryAgain}
            className="flex-1 py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>

          {/* Next Button (Active if step is finished or student advances) */}
          <button
            type="button"
            onClick={handleNextStep}
            disabled={!stepFinished}
            className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
              stepFinished
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 scale-[1.02]'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <span>Next →</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={handleSkip}
            className="py-3 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 font-bold text-xs text-amber-800 flex items-center justify-center gap-1 cursor-pointer transition-colors"
            title="다음 문장으로 건너뛰기"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
