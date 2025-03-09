import React from 'react';

interface LogoProps {
  className?: string;
}

/**
 * Logo component for the application
 * Displays the LorePin logo as an SVG
 */
export const Logo: React.FC<LogoProps> = ({ className = 'h-10 w-auto' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pin Base */}
      <path
        d="M20 0C12.8 0 7 5.8 7 13C7 22.75 20 40 20 40C20 40 33 22.75 33 13C33 5.8 27.2 0 20 0Z"
        fill="url(#gradient)"
      />
      
      {/* Pin Circle */}
      <circle cx="20" cy="13" r="5" fill="white" />
      
      {/* Shooting Star Trail */}
      <path
        d="M30 5L35 0M25 10L30 5M20 15L25 10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 3"
      />
      
      {/* Gradient Definition */}
      <defs>
        <linearGradient id="gradient" x1="7" y1="0" x2="33" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF00FF" />
          <stop offset="1" stopColor="#00FFFF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo; 