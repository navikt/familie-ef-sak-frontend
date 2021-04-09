import * as React from 'react';
import { FC, useState } from 'react';
import {
    IVurdering,
    NullstillVilkårsvurdering,
    OppdaterVilkårsvurdering,
    Vilkårsresultat,
} from '../Inngangsvilkår/vilkår';
import EndreVurdering from './EndreVurdering';
import VisVurdering from './VisVurdering';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Ressurs, RessursSuksess } from '../../../typer/ressurs';
import { KnappWrapper } from '../../Oppgavebenk/OppgaveFiltrering';
import { useBehandling } from '../../../context/BehandlingContext';
import { ReglerResponse } from './typer';

export enum Redigeringsmodus {
    REDIGERING = 'REDIGERING',
    VISNING = 'VISNING',
    IKKE_PÅSTARTET = 'IKKE_PÅSTARTET',
}

interface Props {
    vurdering: IVurdering;
    lagreVurdering: (vurdering: OppdaterVilkårsvurdering) => Promise<Ressurs<IVurdering>>;
    nullstillVurdering: (
        nullstillVilkårsvurdering: NullstillVilkårsvurdering
    ) => Promise<Ressurs<IVurdering>>;
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
    nullstillVurdering,
    lagreVurdering,
    feilmelding,
}) => {
    const [redigeringsmodus, settRedigeringsmodus] = useState<Redigeringsmodus>(
        utledRedigeringsmodus(feilmelding, vurdering)
    );

    const { regler } = useBehandling();

    const ikkeVurder = () => {
        lagreVurdering({
            id: vurdering.id,
            behandlingId: vurdering.behandlingId,
            delvilkårsvurderinger: (regler as RessursSuksess<ReglerResponse>).data.vilkårsregler[
                vurdering.vilkårType
            ].hovedregler
                .map((regelId) => ({ regelId }))
                .map((regelIdObjekt) => ({
                    resultat: Vilkårsresultat.SKAL_IKKE_VURDERES,
                    vurderinger: Array.of(regelIdObjekt),
                })),
        }).then(() => settRedigeringsmodus(Redigeringsmodus.VISNING));
    };

    switch (redigeringsmodus) {
        case Redigeringsmodus.IKKE_PÅSTARTET:
            return (
                <KnappWrapper>
                    <Knapp
                        className="flex-item"
                        mini
                        onClick={() => settRedigeringsmodus(Redigeringsmodus.REDIGERING)}
                    >
                        Vurder vilkår
                    </Knapp>
                    <Flatknapp className="lenke" mini htmlType="button" onClick={ikkeVurder}>
                        Ikke vurder vilkår
                    </Flatknapp>
                </KnappWrapper>
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
                    resetVurdering={nullstillVurdering}
                    feilmelding={feilmelding}
                />
            );
    }
};
export default VisEllerEndreVurdering;
