
import React from 'react';

const FunParkLogo = ({ className = "h-10 w-auto" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 220 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FunPark.kz Logo"
      role="img"
    >
      {/* Abstract Active Child / Play Symbol */}
      <path 
        d="M24 10C27.3137 10 30 12.6863 30 16C30 19.3137 27.3137 22 24 22C20.6863 22 18 19.3137 18 16C18 12.6863 20.6863 10 24 10Z" 
        fill="hsl(var(--primary))"
      />
      <path 
        d="M32 26C32 22.6863 29.3137 20 26 20H22C16.4772 20 12 24.4772 12 30V38H18V30C18 27.7909 19.7909 26 22 26H26V38H32V26Z" 
        fill="hsl(var(--primary))"
      />
      
      {/* Dynamic ball / play element */}
      <circle cx="42" cy="32" r="6" fill="hsl(var(--accent))" />
      
      {/* Slide / Park Base element */}
      <path 
        d="M6 38C6 29.1634 13.1634 22 22 22" 
        stroke="hsl(var(--secondary))" 
        strokeWidth="4" 
        strokeLinecap="round"
      />

      {/* FunPark.kz Text */}
      <text 
        x="56" 
        y="34" 
        style={{ fontFamily: 'var(--font-playful, "Fredoka", sans-serif)' }}
      >
        <tspan fontWeight="800" fontSize="28" letterSpacing="-0.03em">
          <tspan fill="#EF4444">F</tspan>
          <tspan fill="#F97316">u</tspan>
          <tspan fill="#F97316">n</tspan>
          <tspan fill="#22C55E">P</tspan>
          <tspan fill="#06B6D4">a</tspan>
          <tspan fill="#2563EB">r</tspan>
          <tspan fill="#A855F7">k</tspan>
        </tspan>
        <tspan fontWeight="700" fontSize="20" fill="hsl(var(--primary))" dx="2">.kz</tspan>
      </text>
    </svg>
  );
};

export default FunParkLogo;
