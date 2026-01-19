import React from 'react';

export const DisneyPlusIcon: React.FC = () => (
    <svg className="w-8 h-8" viewBox="0 0 256 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
        <defs>
            <linearGradient id="disney-plus-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3d57c8"/>
                <stop offset="100%" stopColor="#00c3f5"/>
            </linearGradient>
        </defs>
        <path fill="url(#disney-plus-gradient)" d="M13.25 158.4C59.97 149.52 93.1 118.8 114.35 77.26c20.35-39.9 28.52-87.16 29-87.16L1.87 1.62C1.35 2.15 1.1 2.92 1.1 3.74v150.92c0 1.25.75 2.4 1.9 2.9l10.25.84zm229.49-156.78L130.13 1.1c-.26 0-.54 0-.8 0-.2 0-.4 0-.62.02L15.34 1.62c-2.3-.02-4.1 2.3-3.2 4.45l112.9 150.9c.5.67 1.3 1.03 2.1 1.03s1.6-.36 2.1-1.03L241.83 6.07c.88-2.15-.9-4.45-3.1-4.45z"/>
    </svg>
);
