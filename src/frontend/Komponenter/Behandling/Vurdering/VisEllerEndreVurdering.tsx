import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import {
    IVurdering,
    OppdaterVilkårsvurdering,
    SvarPåVilkårsvurdering,
    Vilkårsresultat,
} from '../Inngangsvilkår/vilkår';
import EndreVurdering from './EndreVurdering';
import VisVurdering from './VisVurdering';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';
import {
    EkspandertTilstand,
    useEkspanderbareVilkårpanelContext,
} from '../../../App/context/EkspanderbareVilkårpanelContext';
import { ModalState } from '../Modal/NyEierModal';
import { utledSkalViseGjenbrukKnapp } from './utils';
import { IkkePåstartetVurdering } from './IkkePåstartetVurdering';

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
    const {
        behandlingErRedigerbar,
        hentAnsvarligSaksbehandler,
        hentBehandling,
        settNyEierModalState,
        vilkårState,
    } = useBehandling();

    const { gjenbrukEnkelVilkårsvurdering, gjenbrukbareVilkårsvurderinger } = vilkårState;

    const { settPanelITilstand } = useEkspanderbareVilkårpanelContext();
    const [redigeringsmodus, settRedigeringsmodus] = useState<Redigeringsmodus>(
        utledRedigeringsmodus(feilmelding, vurdering, behandlingErRedigerbar)
    );
    const [resetFeilmelding, settResetFeilmelding] = useState<string | undefined>();
    const { nullstillIkkePersistertKomponent, erSaksbehandler } = useApp();

    useEffect(() => {
        settRedigeringsmodus(utledRedigeringsmodus(feilmelding, vurdering, behandlingErRedigerbar));
    }, [vurdering, feilmelding, behandlingErRedigerbar]);

    const håndterIkkeVurderVilkår = () => {
        nullstillIkkePersistertKomponent(vurdering.id);
        ikkeVurderVilkår({
            id: vurdering.id,
            behandlingId: vurdering.behandlingId,
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                settRedigeringsmodus(Redigeringsmodus.VISNING);
                hentBehandling.rerun();
            } else {
                settNyEierModalState(ModalState.LUKKET);
                hentAnsvarligSaksbehandler.rerun();
            }
        });
    };

    const gjenbrukVilkårsvurdering = () => {
        gjenbrukEnkelVilkårsvurdering(vurdering.behandlingId, vurdering.id).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
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
                settNyEierModalState(ModalState.LUKKET);
                hentAnsvarligSaksbehandler.rerun();
            }
        });

    const startVilkårsredigering = () => {
        settRedigeringsmodus(Redigeringsmodus.REDIGERING);
        settPanelITilstand(vurdering.vilkårType, EkspandertTilstand.KAN_IKKE_LUKKES);
    };

    const skalViseGjenbrukKnapp = utledSkalViseGjenbrukKnapp(
        vurdering,
        gjenbrukbareVilkårsvurderinger
    );

    switch (redigeringsmodus) {
        case Redigeringsmodus.IKKE_PÅSTARTET:
            return (
                <IkkePåstartetVurdering
                    skalViseGjenbrukKnapp={skalViseGjenbrukKnapp}
                    håndterIkkeVurderVilkår={håndterIkkeVurderVilkår}
                    startVilkårsredigering={startVilkårsredigering}
                    gjenbrukVilkårsvurdering={gjenbrukVilkårsvurdering}
                    venstreKnappetekst={venstreKnappetekst}
                    høyreKnappetekst={høyreKnappetekst}
                />
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
                    startRedigering={startVilkårsredigering}
                    resetVurdering={resetVurdering}
                    feilmelding={feilmelding || resetFeilmelding}
                    behandlingErRedigerbar={behandlingErRedigerbar && erSaksbehandler}
                    tittelTekst={tittelTekstVisVurdering}
                    gjenbrukVilkårsvurdering={gjenbrukVilkårsvurdering}
                    gjenbrukbareVilkårsvurderinger={gjenbrukbareVilkårsvurderinger}
                />
            );
    }
};
export default VisEllerEndreVurdering;
