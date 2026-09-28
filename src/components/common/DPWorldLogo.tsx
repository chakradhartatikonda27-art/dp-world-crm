'use client';

import React from 'react';

interface DPWorldLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  showSubtag?: boolean;
}

export const DPWorldLogo: React.FC<DPWorldLogoProps> = ({
  className = "h-8",
  theme = 'dark',
  showSubtag = true,
}) => {
  const isLight = theme === 'light';

  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Signature DP World Vector Swoosh Mark */}
      <svg className="h-8 w-auto shrink-0" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 38c7 10 20 15 32 8 5-3 8-8 8-13 0 9-5 18-14 22-12 5-25 0-32-10z" fill="#7F8B95" />
        <path d="M16 37c8-2 16-7 21-15 4-6 5-12 3-16 7 7 7 18 2 27-6 11-17 17-26 15z" fill="#00A3E0" />
        <path d="M21 27c6-7 13-12 21-14-3 4-4 9-3 14-5 2-11 2-18 0z" fill="#E31837" />
      </svg>

      <div className="flex flex-col">
        <div className="flex items-center space-x-1.5">
          <span className={`font-black text-xl tracking-tight font-sans ${isLight ? 'text-slate-900 dark:text-slate-100' : 'text-white'}`}>
            DP WORLD
          </span>
        </div>
        {showSubtag && (
          <span className={`text-[9px] font-extrabold tracking-[0.2em] uppercase -mt-1 ${isLight ? 'text-sky-700' : 'text-sky-400'}`}>
            RWANDA • KIGALI
          </span>
        )}
      </div>
    </div>
  );
};
