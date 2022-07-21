import React, { FC } from 'react';
import Oppfylt from './Oppfylt';
import IkkeOppfylt from './IkkeOppfylt';
import { Vilkårsresultat } from '../../Komponenter/Behandling/Inngangsvilkår/vilkår';
import IkkeVurdert from './IkkeVurdert';
import Info from './Info';

export const ResultatSwitch: FC<{
    vilkårsresultat?: Vilkårsresultat;
    className?: string;
    height?: number;
    width?: number;
}> = ({ vilkårsresultat, className, height = 23, width = 21 }) => {
    switch (vilkårsresultat) {
        case Vilkårsresultat.OPPFYLT:
            return <Oppfylt className={className} heigth={height} width={width} />;
        case Vilkårsresultat.IKKE_TATT_STILLING_TIL:
            return <IkkeVurdert className={className} heigth={height} width={width} />;
        case Vilkårsresultat.SKAL_IKKE_VURDERES:
            return <Info className={className} heigth={height} width={width} />;
        default:
            return <IkkeOppfylt className={className} heigth={height} width={width} />;
    }
};
