import React from 'react';

interface LeoCharacterProps {
  mood?: 'waving' | 'speaking' | 'listening' | 'celebrating' | 'happy';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LeoCharacter: React.FC<LeoCharacterProps> = ({
  mood = 'waving',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        {/* Soft background glow */}
        <circle cx="60" cy="60" r="54" fill="#FEF3C7" fillOpacity="0.45" />

        {/* Body / Orange & Blue City Jacket */}
        <path
          d="M32 108C32 88 42 80 60 80C78 80 88 88 88 108"
          fill="#3B82F6"
        />
        {/* Jacket collar / inner shirt */}
        <path d="M50 80L60 92L70 80" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="100" r="2.5" fill="#FFFFFF" />

        {/* Neck */}
        <rect x="53" y="68" width="14" height="15" rx="4" fill="#FCD34D" />

        {/* Ears */}
        <circle cx="36" cy="54" r="6" fill="#FBBF24" />
        <circle cx="84" cy="54" r="6" fill="#FBBF24" />

        {/* Face */}
        <circle cx="60" cy="54" r="25" fill="#FDE68A" />

        {/* Cute blush cheeks */}
        <ellipse cx="44" cy="59" rx="4.5" ry="2.5" fill="#F87171" fillOpacity="0.5" />
        <ellipse cx="76" cy="59" rx="4.5" ry="2.5" fill="#F87171" fillOpacity="0.5" />

        {/* Eyes based on mood */}
        {mood === 'celebrating' || mood === 'happy' ? (
          // Joyful smiling eyes (arcs)
          <>
            <path d="M44 51C46 47 50 47 52 51" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
            <path d="M68 51C70 47 74 47 76 51" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : mood === 'listening' ? (
          // Attentive listening eyes
          <>
            <circle cx="48" cy="50" r="4" fill="#1F2937" />
            <circle cx="72" cy="50" r="4" fill="#1F2937" />
            <circle cx="49" cy="48" r="1.5" fill="#FFFFFF" />
            <circle cx="73" cy="48" r="1.5" fill="#FFFFFF" />
          </>
        ) : (
          // Friendly open eyes
          <>
            <ellipse cx="48" cy="50" rx="3.5" ry="4" fill="#1F2937" />
            <ellipse cx="72" cy="50" rx="3.5" ry="4" fill="#1F2937" />
            <circle cx="49" cy="48" r="1.2" fill="#FFFFFF" />
            <circle cx="73" cy="48" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* Eyebrows */}
        <path d="M44 43C47 41 51 42 53 44" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />
        <path d="M67 44C69 42 73 41 76 43" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

        {/* Mouth */}
        {mood === 'speaking' ? (
          <path d="M52 61C52 66 68 66 68 61Z" fill="#B91C1C" />
        ) : mood === 'celebrating' || mood === 'happy' ? (
          <path d="M51 59C53 66 67 66 69 59" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" fill="#DC2626" />
        ) : (
          <path d="M53 60C56 64 64 64 67 60" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Hair - Friendly brown spiky hair & Cap */}
        <path
          d="M36 46C34 32 46 22 60 22C74 22 86 32 84 46C82 46 80 43 76 42C72 40 68 43 64 42C60 40 56 42 52 42C48 42 44 41 40 43C37 44 36 46 36 46Z"
          fill="#78350F"
        />

        {/* Cool modern teal cap */}
        <path
          d="M37 36C40 22 55 18 64 18C74 18 84 24 83 36C83 37 37 37 37 36Z"
          fill="#0D9488"
        />
        {/* Cap visor */}
        <path
          d="M48 26C56 22 75 22 88 28C89 30 78 33 62 33C50 33 46 29 48 26Z"
          fill="#115E59"
        />
        {/* Pin badge on cap */}
        <circle cx="56" cy="24" r="3" fill="#FBBF24" />

        {/* Hands / Gesture */}
        {mood === 'waving' && (
          <g className="animate-bounce" style={{ animationDuration: '2s' }}>
            {/* Waving Right Hand */}
            <path
              d="M87 90C93 84 98 72 96 64C94 59 89 60 88 64C87 67 86 73 83 78"
              fill="#FBBF24"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            {/* Hand palm */}
            <circle cx="96" cy="62" r="6" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="93" cy="56" r="2.5" fill="#FDE68A" />
            <circle cx="98" cy="55" r="2.5" fill="#FDE68A" />
            <circle cx="102" cy="58" r="2.5" fill="#FDE68A" />
          </g>
        )}

        {mood === 'celebrating' && (
          <>
            {/* Both hands raised in celebration */}
            <circle cx="24" cy="52" r="6" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M34 85L24 55" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" />
            <circle cx="96" cy="52" r="6" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M86 85L96 55" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" />
          </>
        )}
      </svg>
    </div>
  );
};
