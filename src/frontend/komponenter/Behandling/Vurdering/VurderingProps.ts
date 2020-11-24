import { IInngangsvilkårGrunnlag, IVurdering } from '../Inngangsvilkår/vilkår';
import { Dispatch, ReactChild, SetStateAction } from 'react';
import { IVilkårConfig } from '../Inngangsvilkår/config/VurderingConfig';

// Denne ligger separat slik att man kan gjennbruke den hvis man skal opprette flere typer av Vurderings-components
export interface VurderingProps {
    config: IVilkårConfig;
    grunnlag: IInngangsvilkårGrunnlag;
    vurdering: IVurdering;
    settVurdering: Dispatch<SetStateAction<IVurdering>>;
    lagreKnapp: (visLagreKnapp: boolean) => ReactChild | undefined;
}
