import * as React from 'react';
import { FC, useState } from 'react';
import { IInngangsvilkår, IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import VisVurdering from './VisVurdering';
import EndreVurdering from './EndreVurdering';
import { Ressurs } from '../../../typer/ressurs';

interface Props {
    vurdering: IVurdering;
    inngangsvilkår: IInngangsvilkår;
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
}

const VisEllerEndreVurdering: FC<Props> = ({ vurdering, lagreVurdering, inngangsvilkår }) => {
    const [redigeringsmodus, settRedigeringsmodus] = useState<boolean>(
        vurdering.resultat === Vilkårsresultat.IKKE_VURDERT
    );

    return redigeringsmodus ? (
        <EndreVurdering
            inngangsvilkår={inngangsvilkår}
            data={vurdering}
            lagreVurdering={lagreVurdering}
            settRedigeringsmodus={settRedigeringsmodus}
        />
    ) : (
        <VisVurdering vurdering={vurdering} settRedigeringsmodus={settRedigeringsmodus} />
    );
};
export default VisEllerEndreVurdering;
