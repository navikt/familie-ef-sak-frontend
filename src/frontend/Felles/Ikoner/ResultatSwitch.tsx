import React, { FC } from 'react';
import Oppfylt from './Oppfylt';
import IkkeOppfylt from './IkkeOppfylt';

export const ResultatSwitch: FC<{
    evaluering: boolean;
    className?: string;
    heigth?: number;
    width?: number;
}> = ({ evaluering, className, heigth = 23, width = 21 }) => {
    if (evaluering) {
        return <Oppfylt className={className} heigth={heigth} width={width} />;
    }
    return <IkkeOppfylt className={className} heigth={heigth} width={width} />;
};
