import React from 'react';

export const MaxIcon: React.FC = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="maxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#002BE7" />
          <stop offset="100%" stopColor="#54D6FF" />
        </linearGradient>
      </defs>
      <path fill="url(#maxGrad)" d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,14.5c-1.38,0-2.5-1.12-2.5-2.5 s1.12-2.5,2.5-2.5s2.5,1.12,2.5,2.5S13.38,14.5,12,14.5z"/>
    </svg>
);
