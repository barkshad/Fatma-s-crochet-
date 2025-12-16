import React from 'react';

const StitchedSeparator: React.FC<{ className?: string, reverse?: boolean }> = ({ className = "", reverse = false }) => {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${className}`}>
      <svg 
        viewBox="0 0 1200 40" 
        preserveAspectRatio="none" 
        className={`w-full h-6 md:h-10 text-brand-roseDark/30 ${reverse ? 'rotate-180' : ''}`}
      >
        <path 
          d="M0,20 Q30,40 60,20 T120,20 T180,20 T240,20 T300,20 T360,20 T420,20 T480,20 T540,20 T600,20 T660,20 T720,20 T780,20 T840,20 T900,20 T960,20 T1020,20 T1080,20 T1140,20 T1200,20" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeDasharray="8 8" 
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default StitchedSeparator;