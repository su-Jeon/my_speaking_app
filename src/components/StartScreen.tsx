import React, { useState } from 'react';
import { RoundId } from '../types';
import { KEYWORDS_PREVIEW } from '../data/dialogue';
import { LeoCharacter } from './LeoCharacter';
import { soundManager } from '../utils/audio';
import { Volume2, Sparkles, ShieldCheck, Compass } from 'lucide-react';

interface StartScreenProps {
  selectedRound: RoundId;
  onSelectRound: (round: RoundId) => void;
  onStart: () => void;
  lastStars: Record<RoundId, number | null>;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedRound,
  onSelectRound,
  onStart,
  lastStars,
}) => {
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const handlePlayWord = (word: string) => {
    soundManager.playChime('click');
    setPlayingWord(word);
    soundManager.speak(word, {
      rate: 0.9,
      onEnd: () => setPlayingWord(null),
    });
  };

  const roundsConfig: {
    id: RoundId;
    title: string;
    sub: string;
    desc: string;
    tag: string;
  }[] = [
    {
      id: 1,
      title: 'Round 1',
      sub: '따라 말하기',
      desc: '문장 전체를 보고 음성을 들으며 연습해요.',
      tag: '초급 추천',
    },
    {
      id: 2,
      title: 'Round 2',
      sub: '빈칸 말하기',
      desc: '핵심 단어 빈칸을 채워가며 말해 봐요.',
      tag: '실력 쑥쑥',
    },
    {
      id: 3,
      title: 'Round 3',
      sub: '혼자 말하기',
      desc: '우리말 뜻만 보고 혼자서 말해 봐요!',
      tag: '자신감 도전',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto px-4 py-6 justify-between select-none">
      {/* Top Header */}
      <header className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2 shadow-xs">
          <Compass className="w-3.5 h-3.5 text-amber-700 animate-spin" style={{ animationDuration: '8s' }} />
          <span>중학교 2~3학년 영어 말하기 · CEFR A2</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
          Which Way?
        </h1>
        <p className="text-base font-bold text-amber-600 mt-0.5">Directions Talk</p>
        <p className="text-xs text-slate-500 mt-1">
          Student ID: 2021314131 · SeungUk Cheon
        </p>
      </header>

      {/* Middle: Leo Waving + Mission Speech Bubble */}
      <div className="my-5 flex flex-col items-center">
        <div className="relative w-full max-w-md bg-white rounded-3xl p-5 border-2 border-amber-200/90 shadow-lg shadow-amber-100/50 flex flex-col items-center">
          {/* Leo Character */}
          <div className="relative mb-2">
            <LeoCharacter mood="waving" size="lg" />
            {/* Friendly Speech Bubble from Leo */}
            <div className="absolute -top-3 -right-6 sm:-right-8 bg-amber-500 text-white font-extrabold text-sm sm:text-base px-3.5 py-1.5 rounded-2xl shadow-md border-2 border-white transform rotate-2 animate-pulse">
              Hi! Need some help? 👋
            </div>
          </div>

          {/* Today's Mission in Korean */}
          <div className="w-full bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-center mb-4">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 오늘의 상황 미션
            </div>
            <p className="text-sm font-bold text-slate-800 leading-snug">
              &ldquo;여행 중 길을 잃었어요.<br />
              <span className="text-blue-600 underline decoration-amber-400 decoration-2">Leo에게 지하철역 가는 길</span>을 물어보세요!&rdquo;
            </p>
          </div>

          {/* Ready Keywords Grid */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-bold text-slate-600">
                🎧 준비 단어 (탭하여 발음 듣기)
              </span>
              <span className="text-[11px] text-amber-700 font-medium">단어 카드를 눌러보세요</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {KEYWORDS_PREVIEW.map((item) => {
                const isPlaying = playingWord === item.word;
                return (
                  <button
                    key={item.word}
                    type="button"
                    onClick={() => handlePlayWord(item.word)}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-md scale-95'
                        : 'bg-slate-50 hover:bg-amber-100/60 border-slate-200 text-slate-700 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm">{item.word}</span>
                      <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-slate-900 animate-bounce' : 'text-slate-400'}`} />
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium mt-0.5">{item.meaningKo}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Round Choice & Start Button */}
      <div className="space-y-4">
        {/* Round Choice Cards */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2 px-1">
            연습 모드 선택 (Round Choice)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roundsConfig.map((r) => {
              const isSelected = selectedRound === r.id;
              const stars = lastStars[r.id];
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    soundManager.playChime('click');
                    onSelectRound(r.id);
                  }}
                  className={`relative flex flex-col p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span
                      className={`text-xs font-black ${
                        isSelected ? 'text-blue-700' : 'text-slate-800'
                      }`}
                    >
                      {r.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {r.tag}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {r.sub}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                    {r.desc}
                  </p>

                  {/* Previous stars indicator */}
                  {stars !== null && stars > 0 && (
                    <div className="mt-2 text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      {'⭐'.repeat(stars)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Big Start Button */}
        <button
          type="button"
          onClick={() => {
            soundManager.playChime('step');
            onStart();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white font-extrabold text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
        >
          <span>▶ I&apos;m ready! (시작하기)</span>
        </button>

        {/* Small Privacy Notice */}
        <div className="flex items-start justify-center gap-2 text-[11px] text-slate-500 text-center px-3 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            마이크 음성은 브라우저 내에서만 실시간 인식되며 서버에 저장되거나 전송되지 않습니다.
            로그인 및 개인정보 수집이 없습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
