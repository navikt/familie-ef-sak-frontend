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
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { KnappWrapper } from '../../Oppgavebenk/OppgaveFiltrering';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';

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
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    ikkeVurderVilkår: (
        nullstillVilkårsvurdering: OppdaterVilkårsvurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    feilmelding: string | undefined;
    venstreKnappetekst?: string;
    høyreKnappetekst?: string;
    tittelTekstVisVurdering?: string;
}

function utledRedigeringsmodus(
    feilmelding: string | undefined,
    vurdering: IVurdering,
    behandlingErRedigerbar: boolean
): Redigeringsmodus {
    if (!behandlingErRedigerbar) {
        return Redigeringsmodus.VISNING;
    }
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
    venstreKnappetekst,
    høyreKnappetekst,
    tittelTekstVisVurdering,
}) => {
    const { behandlingErRedigerbar, hentBehandling } = useBehandling();
    const [redigeringsmodus, settRedigeringsmodus] = useState<Redigeringsmodus>(
        utledRedigeringsmodus(feilmelding, vurdering, behandlingErRedigerbar)
    );
    const [resetFeilmelding, settResetFeilmelding] = useState<string | undefined>();
    const { nullstillIkkePersistertKomponent, erSaksbehandler } = useApp();

    const ikkeVurder = () => {
        nullstillIkkePersistertKomponent(vurdering.id);
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

    const initiellRedigeringsmodus =
        vurdering.resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL
            ? Redigeringsmodus.IKKE_PÅSTARTET
            : Redigeringsmodus.VISNING;

    const resetVurdering = () =>
        nullstillVurdering({
            id: vurdering.id,
            behandlingId: vurdering.behandlingId,
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                settRedigeringsmodus(Redigeringsmodus.IKKE_PÅSTARTET);
                hentBehandling.rerun();
                settResetFeilmelding(undefined);
            } else {
                settResetFeilmelding(response.frontendFeilmelding);
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
                        }}
                    >
                        {venstreKnappetekst ? venstreKnappetekst : 'Vurder vilkår'}
                    </Knapp>
                    <Flatknapp className="lenke" mini htmlType="button" onClick={ikkeVurder}>
                        {høyreKnappetekst ? høyreKnappetekst : 'Ikke vurder vilkår'}
                    </Flatknapp>
                </KnappWrapper>
            );
        case Redigeringsmodus.REDIGERING:
            return (
                <EndreVurdering
                    data={vurdering}
                    lagreVurdering={lagreVurdering}
                    feilmelding={feilmelding || resetFeilmelding}
                    settRedigeringsmodus={settRedigeringsmodus}
                    initiellRedigeringsmodus={initiellRedigeringsmodus}
                />
            );
        case Redigeringsmodus.VISNING:
            return (
                <VisVurdering
                    vurdering={vurdering}
                    settRedigeringsmodus={settRedigeringsmodus}
                    resetVurdering={resetVurdering}
                    feilmelding={feilmelding || resetFeilmelding}
                    behandlingErRedigerbar={behandlingErRedigerbar && erSaksbehandler}
                    tittelTekst={tittelTekstVisVurdering}
                />
            );
    }
};
export default VisEllerEndreVurdering;
