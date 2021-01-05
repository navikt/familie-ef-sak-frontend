import React, { FC } from 'react';
import Oppfylt from '../../../ikoner/Oppfylt';
import IkkeOppfylt from '../../../ikoner/IkkeOppfylt';
import IkkeVurdert from '../../../ikoner/IkkeVurdert';

interface Props {
    erOppfylt: boolean;
}

export enum VilkårStatus {
    IKKE_VURDERT = 'IKKE_VURDERT',
    OPPFYLT = 'OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
}

const VilkårOppfylt: FC<Props> = ({ erOppfylt }) => {
    return erOppfylt ? <Oppfylt heigth={21} width={21} /> : <IkkeOppfylt heigth={21} width={21} />;
};

export const VilkårStatusIkon: FC<{ vilkårStatus: VilkårStatus }> = ({ vilkårStatus }) => {
    switch (vilkårStatus) {
        case VilkårStatus.IKKE_VURDERT:
            return <IkkeVurdert heigth={21} width={21} />;
        case VilkårStatus.OPPFYLT:
            return <Oppfylt heigth={21} width={21} />;
        case VilkårStatus.IKKE_OPPFYLT:
            return <IkkeOppfylt heigth={21} width={21} />;
    }
};

export default VilkårOppfylt;
