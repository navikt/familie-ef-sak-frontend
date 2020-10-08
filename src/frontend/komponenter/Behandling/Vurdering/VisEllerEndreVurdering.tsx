import * as React from 'react';
import { FC, useState } from 'react';
import { IVurdering, VilkårResultat } from '../Inngangsvilkår/vilkår';
import { VurderingConfig } from './VurderingConfig';
import VisVurdering from './VisVurdering';
import EndreVurdering from './EndreVurdering';

interface Props {
    vurdering: IVurdering;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<void>;
}

const VisEllerEndreVurdering: FC<Props> = ({ vurdering, oppdaterVurdering }) => {
    const [redigeringsmodus, settRedigeringsmodus] = useState<boolean>(
        vurdering.resultat !== VilkårResultat.IKKE_VURDERT
    );

    const config = VurderingConfig[vurdering.vilkårType];
    if (!config) {
        return <div>Savner config for {vurdering.vilkårType}</div>;
    }
    return redigeringsmodus ? (
        <VisVurdering
            config={config}
            vurdering={vurdering}
            settRedigeringsmodus={settRedigeringsmodus}
        />
    ) : (
        <EndreVurdering
            config={config}
            data={vurdering}
            oppdaterVurdering={oppdaterVurdering}
            settRedigeringsmodus={settRedigeringsmodus}
        />
    );
};
export default VisEllerEndreVurdering;
