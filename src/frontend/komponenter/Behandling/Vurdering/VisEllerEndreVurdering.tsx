import * as React from 'react';
import { FC, useState } from 'react';
import { IInngangsvilkårGrunnlag, IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import VisVurdering from './VisVurdering';
import EndreVurdering from './EndreVurdering';
import { Ressurs } from '@navikt/familie-typer';
import { VurderingConfig } from '../Inngangsvilkår/config/VurderingConfig';

interface Props {
    vurdering: IVurdering;
    grunnlag: IInngangsvilkårGrunnlag;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
}

const VisEllerEndreVurdering: FC<Props> = ({ vurdering, grunnlag, oppdaterVurdering }) => {
    const [redigeringsmodus, settRedigeringsmodus] = useState<boolean>(
        vurdering.resultat === Vilkårsresultat.IKKE_VURDERT
    );

    const config = VurderingConfig[vurdering.vilkårType];
    if (!config) {
        return <div>Savner config for {vurdering.vilkårType}</div>;
    }
    return redigeringsmodus ? (
        <EndreVurdering
            config={config}
            data={vurdering}
            grunnlag={grunnlag}
            oppdaterVurdering={oppdaterVurdering}
            settRedigeringsmodus={settRedigeringsmodus}
        />
    ) : (
        <VisVurdering vurdering={vurdering} settRedigeringsmodus={settRedigeringsmodus} />
    );
};
export default VisEllerEndreVurdering;
