import * as React from 'react';
import {FC, useState} from 'react';
import {
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
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<IVurdering>>;
    feilmelding: string | undefined;
}

function utledRedigeringsmodus(
    feilmelding: string | undefined,
    vurdering: IVurdering
): Redigeringsmodus {
    if (feilmelding !== undefined) {
        return Redigeringsmodus.REDIGERING;
    }
    if (vurdering.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL) {
        return Redigeringsmodus.IKKE_PÅSTARTET;
    }
    return Redigeringsmodus.VISNING;
}

const VisEllerEndreVurdering: FC<Props> = ({
    vurdering,
    lagreVurdering,
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
                    data={vurdering}
                    lagreVurdering={lagreVurdering}
                    feilmelding={feilmelding}
                    settRedigeringsmodus={settRedigeringsmodus}
                />
            );
        case Redigeringsmodus.VISNING:
            return (
                <VisVurdering
                    vurdering={vurdering}
                    settRedigeringsmodus={settRedigeringsmodus}
                    resetVurdering={lagreVurdering}
                    feilmelding={feilmelding}
                />
            );
    }
};
export default VisEllerEndreVurdering;
