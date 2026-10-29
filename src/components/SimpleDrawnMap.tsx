import React from 'react';
import { MapPin } from 'lucide-react';

interface SimpleDrawnMapProps {
  currentStepIndex: number; // 0 to 4 (representing step 1 to 5)
  completedSteps: number[]; // array of step IDs (1-based) that are completed
  isFinished?: boolean;
  className?: string;
}

export const SimpleDrawnMap: React.FC<SimpleDrawnMapProps> = ({
  currentStepIndex,
  completedSteps,
  isFinished = false,
  className = '',
}) => {
  // Checkpoints coordinate layout (viewBox 0 0 500 130)
  const checkpoints = [
    { id: 1, x: 45, y: 70, label: 'Start', ko: '시작 위치', icon: '📍' },
    { id: 2, x: 145, y: 40, label: 'Bank', ko: '은행 코너', icon: '🏦' },
    { id: 3, x: 250, y: 85, label: 'Park', ko: '공원 옆', icon: '🌳' },
    { id: 4, x: 355, y: 45, label: 'Walkway', ko: '5분 거리', icon: '🚶' },
    { id: 5, x: 455, y: 70, label: 'Station', ko: '지하철역', icon: 'Ⓜ️' },
  ];

  // Which segments are unlocked?
  // Segment 1: from pt1 to pt2 -> unlocked if completedSteps includes 1
  // Segment 2: from pt2 to pt3 -> unlocked if completedSteps includes 2
  // Segment 3: from pt3 to pt4 -> unlocked if completedSteps includes 3
  // Segment 4: from pt4 to pt5 -> unlocked if completedSteps includes 4

  const isSegmentActive = (segIndex: number) => {
    return completedSteps.includes(segIndex + 1);
  };

  const currentPt = isFinished
    ? checkpoints[4]
    : checkpoints[Math.min(currentStepIndex, 4)];

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-amber-100/60 to-orange-50/70 border border-amber-200/80 p-3 shadow-inner ${className}`}>
      {/* Map header tag */}
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-xs font-bold text-amber-900/80 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span>지하철역 가는 길 지도 (Directions Map)</span>
        </span>
        <span className="text-[11px] font-semibold text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded-full">
          {isFinished
            ? '🎉 도착 완료!'
            : `진행도: ${completedSteps.length} / 5 단계`}
        </span>
      </div>

      <svg
        viewBox="0 0 500 120"
        className="w-full h-auto select-none overflow-visible"
        style={{ minHeight: '85px' }}
      >
        <defs>
          <linearGradient id="activePathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#047857" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Base roadmap background - cute soft paths */}
        <path
          d="M 45 70 C 95 70, 95 40, 145 40 C 195 40, 200 85, 250 85 C 300 85, 305 45, 355 45 C 405 45, 405 70, 455 70"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Road dashed center line */}
        <path
          d="M 45 70 C 95 70, 95 40, 145 40 C 195 40, 200 85, 250 85 C 300 85, 305 45, 355 45 C 405 45, 405 70, 455 70"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="2"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />

        {/* Segment 1: Start -> Bank */}
        {isSegmentActive(0) && (
          <path
            d="M 45 70 C 95 70, 95 40, 145 40"
            fill="none"
            stroke="url(#activePathGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#shadowGlow)"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Segment 2: Bank -> Park */}
        {isSegmentActive(1) && (
          <path
            d="M 145 40 C 195 40, 200 85, 250 85"
            fill="none"
            stroke="url(#activePathGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#shadowGlow)"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Segment 3: Park -> Walkway */}
        {isSegmentActive(2) && (
          <path
            d="M 250 85 C 300 85, 305 45, 355 45"
            fill="none"
            stroke="url(#activePathGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#shadowGlow)"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Segment 4: Walkway -> Station */}
        {isSegmentActive(3) && (
          <path
            d="M 355 45 C 405 45, 405 70, 455 70"
            fill="none"
            stroke="url(#activePathGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            filter="url(#shadowGlow)"
            className="transition-all duration-700 ease-out"
          />
        )}

        {/* Checkpoint Nodes */}
        {checkpoints.map((pt, idx) => {
          const isPassed = completedSteps.includes(pt.id) || (idx === 0 && completedSteps.length > 0);
          const isCurrent = !isFinished && idx === currentStepIndex;

          return (
            <g key={pt.id} className="transition-transform duration-300">
              {/* Outer circle */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isCurrent ? '16' : '13'}
                fill={isPassed ? '#10B981' : isCurrent ? '#3B82F6' : '#FFFFFF'}
                stroke={isPassed ? '#059669' : isCurrent ? '#1D4ED8' : '#D1D5DB'}
                strokeWidth={isCurrent ? '3' : '2'}
                className="drop-shadow-sm"
              />

              {/* Icon text */}
              <text
                x={pt.x}
                y={pt.y + 4}
                textAnchor="middle"
                fontSize={isCurrent ? '12' : '10'}
                className="select-none pointer-events-none"
              >
                {pt.icon}
              </text>

              {/* Subtitle label */}
              <text
                x={pt.x}
                y={pt.y + 24}
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill={isCurrent ? '#1E40AF' : isPassed ? '#065F46' : '#6B7280'}
              >
                {pt.label}
              </text>
            </g>
          );
        })}

        {/* Current Position Marker (Floating Leo avatar icon) */}
        {!isFinished && (
          <g
            transform={`translate(${currentPt.x}, ${currentPt.y - 18})`}
            className="animate-bounce"
            style={{ animationDuration: '1.8s' }}
          >
            <circle cx="0" cy="-6" r="10" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
            <text x="0" y="-3" textAnchor="middle" fontSize="10">
              🧑
            </text>
            {/* small pointer triangle */}
            <polygon points="-4,2 4,2 0,7" fill="#F59E0B" />
          </g>
        )}

        {/* Finished Celebration Flag at subway station */}
        {isFinished && (
          <g transform="translate(455, 38)" className="animate-bounce">
            <rect x="-8" y="-12" width="16" height="12" rx="2" fill="#DC2626" />
            <text x="0" y="-3" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
              GOAL
            </text>
            <line x1="-8" y1="-12" x2="-8" y2="12" stroke="#4B5563" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
