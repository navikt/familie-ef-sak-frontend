import React, { FC } from 'react';
import Oppfylt from './Oppfylt';
import IkkeOppfylt from './IkkeOppfylt';
import IkkeVurdert from './IkkeVurdert';
import { Vilkårsresultat } from '../../Komponenter/Behandling/Inngangsvilkår/vilkår';
import Info from './Info';

export const VilkårsresultatIkon: FC<{
    vilkårsresultat: Vilkårsresultat;
    className?: string;
    heigth?: number;
    width?: number;
}> = ({ vilkårsresultat, className, heigth = 23, width = 21 }) => {
    switch (vilkårsresultat) {
        case Vilkårsresultat.IKKE_TATT_STILLING_TIL:
            return <IkkeVurdert className={className} heigth={heigth} width={width} />;
        case Vilkårsresultat.OPPFYLT:
        case Vilkårsresultat.AUTOMATISK_OPPFYLT:
            return <Oppfylt className={className} heigth={heigth} width={width} />;
        case Vilkårsresultat.IKKE_OPPFYLT:
            return <IkkeOppfylt className={className} heigth={heigth} width={width} />;
        case Vilkårsresultat.SKAL_IKKE_VURDERES:
            return <Info heigth={heigth} width={width} />;
        default:
            return null;
    }
};
