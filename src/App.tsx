import React, { useState, useEffect } from 'react';
import { RoundId, StepRecord } from './types';
import { DIALOGUE_STEPS } from './data/dialogue';
import { StartScreen } from './components/StartScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { ResultScreen } from './components/ResultScreen';

export default function App() {
  const [screen, setScreen] = useState<'start' | 'practice' | 'result'>('start');
  const [selectedRound, setSelectedRound] = useState<RoundId>(1);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepRecords, setStepRecords] = useState<StepRecord[]>([]);

  // Persistent storage for last star rating per round on this device
  const [lastStars, setLastStars] = useState<Record<RoundId, number | null>>({
    1: null,
    2: null,
    3: null,
  });

  // Load last stars on mount
  useEffect(() => {
    try {
      const r1 = localStorage.getItem('which_way_stars_r1');
      const r2 = localStorage.getItem('which_way_stars_r2');
      const r3 = localStorage.getItem('which_way_stars_r3');
      setLastStars({
        1: r1 ? parseInt(r1, 10) : null,
        2: r2 ? parseInt(r2, 10) : null,
        3: r3 ? parseInt(r3, 10) : null,
      });
    } catch {
      // localStorage may not be available in strict sandboxes
    }
  }, []);

  const saveRoundStars = (round: RoundId, stars: number) => {
    try {
      localStorage.setItem(`which_way_stars_r${round}`, stars.toString());
      setLastStars((prev) => ({
        ...prev,
        [round]: stars,
      }));
    } catch {
      // ignore
    }
  };

  const handleStart = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setStepRecords([]);
    setScreen('practice');
  };

  const handleCompleteStep = (
    stepId: number,
    recognizedText: string,
    attempts: number
  ) => {
    const updatedRecords: StepRecord[] = [
      ...stepRecords.filter((r) => r.stepId !== stepId),
      {
        stepId,
        status: 'completed',
        attempts,
        recognizedText,
      },
    ];
    setStepRecords(updatedRecords);

    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) => [...prev, stepId]);
    }

    if (currentStepIndex < DIALOGUE_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // All 5 steps reached! Calculate stars and transition to Result
      const skipCount = updatedRecords.filter((r) => r.status === 'skipped').length;
      let stars = 3;
      if (skipCount === 0) stars = 3;
      else if (skipCount <= 2) stars = 2;
      else stars = 1;

      saveRoundStars(selectedRound, stars);
      setScreen('result');
    }
  };

  const handleSkipStep = (stepId: number) => {
    const updatedRecords: StepRecord[] = [
      ...stepRecords.filter((r) => r.stepId !== stepId),
      {
        stepId,
        status: 'skipped',
        attempts: 0,
        recognizedText: '',
      },
    ];
    setStepRecords(updatedRecords);

    if (currentStepIndex < DIALOGUE_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      const skipCount = updatedRecords.filter((r) => r.status === 'skipped').length;
      let stars = 3;
      if (skipCount === 0) stars = 3;
      else if (skipCount <= 2) stars = 2;
      else stars = 1;

      saveRoundStars(selectedRound, stars);
      setScreen('result');
    }
  };

  const handleNextRound = () => {
    if (selectedRound < 3) {
      const nextRound = (selectedRound + 1) as RoundId;
      setSelectedRound(nextRound);
    }
    handleStart();
  };

  const handlePracticeAgain = () => {
    handleStart();
  };

  const handleGoHome = () => {
    setScreen('start');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-amber-200 selection:text-slate-900">
      <main className="w-full">
        {screen === 'start' && (
          <StartScreen
            selectedRound={selectedRound}
            onSelectRound={(r) => setSelectedRound(r)}
            onStart={handleStart}
            lastStars={lastStars}
          />
        )}

        {screen === 'practice' && (
          <PracticeScreen
            currentStep={DIALOGUE_STEPS[currentStepIndex]}
            stepIndex={currentStepIndex}
            totalSteps={DIALOGUE_STEPS.length}
            currentRound={selectedRound}
            completedSteps={completedSteps}
            onCompleteStep={handleCompleteStep}
            onSkipStep={handleSkipStep}
            onExitToHome={handleGoHome}
          />
        )}

        {screen === 'result' && (
          <ResultScreen
            currentRound={selectedRound}
            records={stepRecords}
            previousStars={lastStars[selectedRound]}
            onNextRound={handleNextRound}
            onPracticeAgain={handlePracticeAgain}
            onGoHome={handleGoHome}
          />
        )}
      </main>
    </div>
  );
}
