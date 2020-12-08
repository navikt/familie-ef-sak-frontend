import * as React from 'react';
import { FC, useState } from 'react';
import {
    IInngangsvilkårGrunnlag,
    IVurdering,
    Redigeringsmodus,
    Vilkårsresultat,
} from '../Inngangsvilkår/vilkår';
import EndreVurdering from './EndreVurdering';
import VisVurdering from './VisVurdering';
import { Knapp } from 'nav-frontend-knapper';
import { Ressurs } from '../../../typer/ressurs';

interface Props {
    vurdering: IVurdering;
    inngangsvilkårgrunnlag: IInngangsvilkårGrunnlag;
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    feilmelding: string | undefined;
}

function utledRedigeringsmodus(
    feilmelding: string | undefined,
    vurdering: IVurdering
): Redigeringsmodus {
    if (feilmelding !== undefined) {
        return Redigeringsmodus.REDIGERING;
    }
    if (vurdering.resultat === Vilkårsresultat.IKKE_VURDERT) {
        return Redigeringsmodus.IKKE_PÅSTARTET;
    }
    return Redigeringsmodus.VISNING;
}

const VisEllerEndreVurdering: FC<Props> = ({
    vurdering,
    lagreVurdering,
    inngangsvilkårgrunnlag,
    feilmelding,
}) => {
    const [redigeringsmodus, settRedigeringsmodus] = useState<Redigeringsmodus>(
        utledRedigeringsmodus(feilmelding, vurdering)
    );

    switch (redigeringsmodus) {
        case Redigeringsmodus.IKKE_PÅSTARTET:
            return (
                <Knapp mini onClick={() => settRedigeringsmodus(Redigeringsmodus.REDIGERING)}>
                    Vurder vilkår
                </Knapp>
            );
        case Redigeringsmodus.REDIGERING:
            return (
                <EndreVurdering
                    inngangsvilkårgrunnlag={inngangsvilkårgrunnlag}
                    data={vurdering}
                    lagreVurdering={lagreVurdering}
                    feilmelding={feilmelding}
                    settRedigeringsmodus={settRedigeringsmodus}
                />
            );
        case Redigeringsmodus.VISNING:
            return (
                <VisVurdering vurdering={vurdering} settRedigeringsmodus={settRedigeringsmodus} />
            );
    }
};
export default VisEllerEndreVurdering;
