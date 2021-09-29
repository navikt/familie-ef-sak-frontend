import * as React from 'react';
import { FC, useState } from 'react';
import {
    IVurdering,
    OppdaterVilkårsvurdering,
    SvarPåVilkårsvurdering,
    Vilkårsresultat,
} from '../Inngangsvilkår/vilkår';
import EndreVurdering from './EndreVurdering';
import VisVurdering from './VisVurdering';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { KnappWrapper } from '../../Oppgavebenk/OppgaveFiltrering';
import { useBehandling } from '../../../App/context/BehandlingContext';

export enum Redigeringsmodus {
    REDIGERING = 'REDIGERING',
    VISNING = 'VISNING',
    IKKE_PÅSTARTET = 'IKKE_PÅSTARTET',
}

interface Props {
    vurdering: IVurdering;
    lagreVurdering: (vurdering: SvarPåVilkårsvurdering) => Promise<Ressurs<IVurdering>>;
    nullstillVurdering: (
        nullstillVilkårsvurdering: OppdaterVilkårsvurdering
    ) => Promise<Ressurs<IVurdering>>;
    ikkeVurderVilkår: (
        nullstillVilkårsvurdering: OppdaterVilkårsvurdering
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
    ikkeVurderVilkår,
    lagreVurdering,
    feilmelding,
}) => {
    const { behandlingErRedigerbar, hentBehandling, settIkkePersistertKomponent } = useBehandling();
    const [redigeringsmodus, settRedigeringsmodus] = useState<Redigeringsmodus>(
        utledRedigeringsmodus(feilmelding, vurdering)
    );

    const ikkeVurder = () => {
        ikkeVurderVilkår({
            id: vurdering.id,
            behandlingId: vurdering.behandlingId,
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                settRedigeringsmodus(Redigeringsmodus.VISNING);
                hentBehandling.rerun();
            }
        });
    };

    const resetVurdering = () =>
        nullstillVurdering({
            id: vurdering.id,
            behandlingId: vurdering.behandlingId,
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                settRedigeringsmodus(Redigeringsmodus.IKKE_PÅSTARTET);
                hentBehandling.rerun();
            }
        });

    switch (redigeringsmodus) {
        case Redigeringsmodus.IKKE_PÅSTARTET:
            return (
                <KnappWrapper>
                    <Knapp
                        className="flex-item"
                        mini
                        onClick={() => {
                            settRedigeringsmodus(Redigeringsmodus.REDIGERING);
                            settIkkePersistertKomponent(vurdering.id);
                        }}
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
                    resetVurdering={resetVurdering}
                    feilmelding={feilmelding}
                    behandlingErRedigerbar={behandlingErRedigerbar}
                />
            );
    }
};
export default VisEllerEndreVurdering;
