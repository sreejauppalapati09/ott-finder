
import React from 'react';
import { NetflixIcon } from './icons/NetflixIcon';
import { PrimeVideoIcon } from './icons/PrimeVideoIcon';
import { DisneyPlusIcon } from './icons/DisneyPlusIcon';
import { HuluIcon } from './icons/HuluIcon';
import { MaxIcon } from './icons/MaxIcon';
import { AppleTvIcon } from './icons/AppleTvIcon';
import { GenericIcon } from './icons/GenericIcon';

interface PlatformLogoProps {
    platformName: string;
}

export const PlatformLogo: React.FC<PlatformLogoProps> = ({ platformName }) => {
    const name = platformName.toLowerCase();

    if (name.includes('netflix')) return <NetflixIcon />;
    if (name.includes('prime video') || name.includes('amazon prime')) return <PrimeVideoIcon />;
    if (name.includes('disney')) return <DisneyPlusIcon />;
    if (name.includes('hulu')) return <HuluIcon />;
    if (name.includes('max') || name.includes('hbo max')) return <MaxIcon />;
    if (name.includes('apple tv')) return <AppleTvIcon />;
    
    return <GenericIcon />;
};
