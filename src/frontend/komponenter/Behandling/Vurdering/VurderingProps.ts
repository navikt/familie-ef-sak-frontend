import { IVurdering } from '../Inngangsvilkår/vilkår';
import { Dispatch, SetStateAction } from 'react';
import { IVilkårConfig } from '../Inngangsvilkår/config/VurderingConfig';
import { Ressurs } from '@navikt/familie-typer';

// Denne ligger separat slik att man kan gjennbruke den hvis man skal opprette flere typer av Vurderings-components
export interface VurderingProps {
    config: IVilkårConfig;
    vurdering: IVurdering;
    settVurdering: Dispatch<SetStateAction<IVurdering>>;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}
