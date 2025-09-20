import React from 'react';

export const LogoMark: React.FC<{className?: string}> = ({ className="" }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="gwLogoGrad" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#6366f1"/>
        <stop offset="60%" stopColor="#8b5cf6"/>
        <stop offset="100%" stopColor="#ec4899"/>
      </linearGradient>
    </defs>
    <path d="M14 46c-3-3-5-7.5-5-12.5S13 21 20 16c3-2 6-3 12-3s9 1 12 3c7 5 11 12.5 11 17.5S53 43 50 46c-2 2-4 2-6 1l-6-4h-12l-6 4c-2 1-4 1-6-1Z" fill="url(#gwLogoGrad)" stroke="url(#gwLogoGrad)"/>
    <circle cx="25" cy="30" r="4" fill="#0f172a" stroke="#0f172a"/>
    <circle cx="39" cy="30" r="4" fill="#0f172a" stroke="#0f172a"/>
    <path d="M26 40h12" stroke="#0f172a" strokeWidth={4} strokeLinecap="round"/>
  </svg>
);
