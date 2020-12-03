import * as React from 'react';
import { FC, useState } from 'react';
import { IInngangsvilkår, IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import EndreVurdering from './EndreVurdering';
import { Ressurs } from '../../../typer/ressurs';
import VisVurdering from './VisVurdering';
import { Hovedknapp } from 'nav-frontend-knapper';

interface Props {
    vurdering: IVurdering;
    inngangsvilkår: IInngangsvilkår;
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
}

const VisEllerEndreVurdering: FC<Props> = ({ vurdering, lagreVurdering, inngangsvilkår }) => {
    const [redigeringsmodus, settRedigeringsmodus] = useState<boolean | undefined>(
        vurdering.resultat === Vilkårsresultat.IKKE_VURDERT ? undefined : false
    );

    if (redigeringsmodus === undefined) {
        return <Hovedknapp onClick={() => settRedigeringsmodus(true)}>Vurder vilkår</Hovedknapp>;
    } else if (redigeringsmodus) {
        return (
            <EndreVurdering
                inngangsvilkår={inngangsvilkår}
                data={vurdering}
                lagreVurdering={lagreVurdering}
                settRedigeringsmodus={settRedigeringsmodus}
            />
        );
    } else {
        return <VisVurdering vurdering={vurdering} settRedigeringsmodus={settRedigeringsmodus} />;
    }
};
export default VisEllerEndreVurdering;
