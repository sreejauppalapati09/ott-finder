import React from 'react';

interface HeartIconProps {
    filled?: boolean;
}

export const HeartIcon: React.FC<HeartIconProps> = ({ filled = false }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 2}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21s-6.716-4.35-9.428-8.303C.63 9.897 1.5 6 4.828 4.5 7.1 3.47 9.7 4.2 12 6.5c2.3-2.3 4.9-3.03 7.172-2 3.328 1.5 4.198 5.397 2.256 8.197C18.716 16.65 12 21 12 21z"
        />
    </svg>
);
