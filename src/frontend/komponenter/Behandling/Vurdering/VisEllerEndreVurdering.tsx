import * as React from 'react';
import { FC, useState } from 'react';
import {
    IInngangsvilkår,
    IVurdering,
    Redigeringsmodus,
    Vilkårsresultat,
} from '../Inngangsvilkår/vilkår';
import EndreVurdering from './EndreVurdering';
import VisVurdering from './VisVurdering';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Ressurs } from '../../../typer/ressurs';

interface Props {
    vurdering: IVurdering;
    inngangsvilkår: IInngangsvilkår;
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    feilmelding: string | undefined;
}

function utledRedigeringsmodus(
    feilmelding: string | undefined,
    vurdering: IVurdering
): Redigeringsmodus {
    if (feilmelding !== undefined) {
        console.log('Redigeringsmodus');
        return Redigeringsmodus.REDIGERING;
    }
    if (vurdering.resultat === Vilkårsresultat.IKKE_VURDERT) {
        return Redigeringsmodus.IKKE_PÅSTARTET;
    }

    console.log('Visningsmodus');
    return Redigeringsmodus.VISNING;
}

const VisEllerEndreVurdering: FC<Props> = ({
    vurdering,
    lagreVurdering,
    inngangsvilkår,
    feilmelding,
}) => {
    const [redigeringsmodus, settRedigeringsmodus] = useState<Redigeringsmodus>(
        utledRedigeringsmodus(feilmelding, vurdering)
    );

    if (redigeringsmodus === Redigeringsmodus.IKKE_PÅSTARTET) {
        return (
            <Hovedknapp onClick={() => settRedigeringsmodus(Redigeringsmodus.REDIGERING)}>
                Vurder vilkår
            </Hovedknapp>
        );
    } else if (redigeringsmodus === Redigeringsmodus.REDIGERING) {
        return (
            <EndreVurdering
                inngangsvilkår={inngangsvilkår}
                data={vurdering}
                lagreVurdering={lagreVurdering}
                feilmelding={feilmelding}
            />
        );
    } else {
        return <VisVurdering vurdering={vurdering} settRedigeringsmodus={settRedigeringsmodus} />;
    }
};
export default VisEllerEndreVurdering;
