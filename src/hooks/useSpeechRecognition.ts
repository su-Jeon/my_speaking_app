import { useState, useEffect, useRef, useCallback } from 'react';

// SpeechRecognition type declarations for browsers that support it
interface SpeechRecognitionEventLike extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  onspeechend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export type MicState = 'ready' | 'listening' | 'done' | 'disabled';

interface UseSpeechRecognitionOptions {
  onTranscriptComplete: (transcript: string) => void;
  isAudioPlaying: boolean;
}

export function useSpeechRecognition({
  onTranscriptComplete,
  isAudioPlaying,
}: UseSpeechRecognitionOptions) {
  const [micState, setMicState] = useState<MicState>('ready');
  const [transcript, setTranscript] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentTranscriptRef = useRef<string>('');
  const isListeningRef = useRef<boolean>(false);

  // Check support on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionAPI) {
        setIsSupported(false);
      }
    }
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const finishSpeaking = useCallback(
    (finalText: string) => {
      clearSilenceTimer();
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setMicState('done');
      onTranscriptComplete(finalText);

      // Return to ready state after short transition
      setTimeout(() => {
        setMicState((prev) => (prev === 'done' ? 'ready' : prev));
      }, 1400);
    },
    [clearSilenceTimer, onTranscriptComplete]
  );

  const startListening = useCallback(() => {
    if (isAudioPlaying) return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      currentTranscriptRef.current = '';
      setTranscript('');
      setPermissionError(null);
      isListeningRef.current = true;
      setMicState('listening');

      recognition.onstart = () => {
        isListeningRef.current = true;
        setMicState('listening');

        // Initial silence timeout: if nothing is said within 5 seconds, finish with empty
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            finishSpeaking(currentTranscriptRef.current);
          }
        }, 5000);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let interim = '';
        let final = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res && res[0]) {
            final += res[0].transcript;
          }
        }

        const heard = final || interim;
        currentTranscriptRef.current = heard;
        setTranscript(heard);

        // Reset silence timer on new speech: stop after ~1.5s of silence
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            finishSpeaking(currentTranscriptRef.current);
          }
        }, 1500);
      };

      recognition.onspeechend = () => {
        // Speech ended, finalize after 1.2s if no more speech
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            finishSpeaking(currentTranscriptRef.current);
          }
        }, 1200);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        clearSilenceTimer();
        isListeningRef.current = false;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setPermissionError('마이크 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해 주세요.');
          setMicState('ready');
        } else if (event.error === 'no-speech') {
          finishSpeaking('');
        } else {
          setMicState('ready');
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          finishSpeaking(currentTranscriptRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setMicState('ready');
      setIsSupported(false);
    }
  }, [isAudioPlaying, clearSilenceTimer, finishSpeaking]);

  const stopListening = useCallback(() => {
    if (isListeningRef.current) {
      finishSpeaking(currentTranscriptRef.current);
    }
  }, [finishSpeaking]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [clearSilenceTimer]);

  return {
    micState: isAudioPlaying ? 'disabled' : micState,
    transcript,
    setTranscript,
    isSupported,
    permissionError,
    startListening,
    stopListening,
  };
}
