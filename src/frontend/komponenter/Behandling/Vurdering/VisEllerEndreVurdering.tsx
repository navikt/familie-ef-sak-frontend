import * as React from 'react';
import { FC, useState } from 'react';
import { IVurdering, VilkårResultat } from '../Inngangsvilkår/vilkår';
import { VurderingConfig } from './VurderingConfig';
import VisVurdering from './VisVurdering';
import EndreVurdering from './EndreVurdering';
import { Ressurs } from '@navikt/familie-typer';

interface Props {
    vurdering: IVurdering;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
}

const VisEllerEndreVurdering: FC<Props> = ({ vurdering, oppdaterVurdering }) => {
    const [redigeringsmodus, settRedigeringsmodus] = useState<boolean>(
        vurdering.resultat === VilkårResultat.IKKE_VURDERT
    );

    const config = VurderingConfig[vurdering.vilkårType];
    if (!config) {
        return <div>Savner config for {vurdering.vilkårType}</div>;
    }
    return redigeringsmodus ? (
        <EndreVurdering
            config={config}
            data={vurdering}
            oppdaterVurdering={oppdaterVurdering}
            settRedigeringsmodus={settRedigeringsmodus}
        />
    ) : (
        <VisVurdering vurdering={vurdering} settRedigeringsmodus={settRedigeringsmodus} />
    );
};
export default VisEllerEndreVurdering;
