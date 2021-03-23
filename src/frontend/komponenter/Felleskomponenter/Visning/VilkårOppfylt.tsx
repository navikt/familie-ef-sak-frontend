import React, { FC } from 'react';
import Oppfylt from '../../../ikoner/Oppfylt';
import IkkeOppfylt from '../../../ikoner/IkkeOppfylt';
import IkkeVurdert from '../../../ikoner/IkkeVurdert';
import { Vilkårsresultat } from '../../Behandling/Inngangsvilkår/vilkår';

interface Props {
    erOppfylt: boolean;
    className?: string;
}

export const VilkårOppfylt: FC<Props> = ({ erOppfylt, className }) => {
    return erOppfylt ? (
        <Oppfylt className={className} heigth={23} width={21} />
    ) : (
        <IkkeOppfylt className={className} heigth={23} width={21} />
    );
};

export const VilkårsresultatIkon: FC<{ vilkårsresultat: Vilkårsresultat; className?: string }> = ({
    vilkårsresultat,
    className,
}) => {
    switch (vilkårsresultat) {
        case Vilkårsresultat.IKKE_TATT_STILLING_TIL:
            return <IkkeVurdert className={className} heigth={23} width={21} />;
        case Vilkårsresultat.OPPFYLT:
            return <Oppfylt className={className} heigth={23} width={21} />;
        case Vilkårsresultat.IKKE_OPPFYLT:
            return <IkkeOppfylt className={className} heigth={23} width={21} />;
        default:
            return null;
    }
};
