import React, { FC } from 'react';
import Oppfylt from '../../../ikoner/Oppfylt';
import IkkeOppfylt from '../../../ikoner/IkkeOppfylt';
import IkkeVurdert from '../../../ikoner/IkkeVurdert';

interface Props {
    erOppfylt: boolean;
    className?: string;
}

export enum VilkårStatus {
    IKKE_VURDERT = 'IKKE_VURDERT',
    OPPFYLT = 'OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
}

export const VilkårOppfylt: FC<Props> = ({ erOppfylt, className }) => {
    return erOppfylt ? (
        <Oppfylt className={className} heigth={23} width={21} />
    ) : (
        <IkkeOppfylt className={className} heigth={23} width={21} />
    );
};

export const VilkårStatusIkon: FC<{ vilkårStatus: VilkårStatus; className?: string }> = ({
    vilkårStatus,
    className,
}) => {
    switch (vilkårStatus) {
        case VilkårStatus.IKKE_VURDERT:
            return <IkkeVurdert className={className} heigth={23} width={21} />;
        case VilkårStatus.OPPFYLT:
            return <Oppfylt className={className} heigth={23} width={21} />;
        case VilkårStatus.IKKE_OPPFYLT:
            return <IkkeOppfylt className={className} heigth={23} width={21} />;
    }
};
