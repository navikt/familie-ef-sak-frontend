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
import { Button } from '@navikt/ds-react';
import styled from 'styled-components';
import {
    EkspandertTilstand,
    useEkspanderbareVilkårpanelContext,
} from '../../../App/context/EkspanderbareVilkårpanelContext';
import { ModalState } from '../Modal/NyEierModal';

const KnappWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const Knapp = styled(Button)`
    margin-right: 1rem;
`;

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

    const { hentEnkeltInngangsvilkår } = vilkårState;
    // const { hentEnkeltInngangsvilkår, gjenbrukEnkeltInngangsvilkår } = vilkårState;
    const [skalGjenbruke, settSaklGjenbruke] = useState<boolean>(false);
    const [vilkårGjenbruk, settVilkårGjenbruk] = useState<IVurdering | null>(null);

    const { settPanelITilstand } = useEkspanderbareVilkårpanelContext();
    const [redigeringsmodus, settRedigeringsmodus] = useState<Redigeringsmodus>(
        utledRedigeringsmodus(feilmelding, vurdering, behandlingErRedigerbar)
    );
    const [resetFeilmelding, settResetFeilmelding] = useState<string | undefined>();
    const { nullstillIkkePersistertKomponent, erSaksbehandler } = useApp();

    useEffect(() => {
        settRedigeringsmodus(utledRedigeringsmodus(feilmelding, vurdering, behandlingErRedigerbar));
    }, [vurdering, feilmelding, behandlingErRedigerbar]);

    const ikkeVurder = () => {
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

    const hentResponsForEnkeltVilkår = async () => {
        settSaklGjenbruke(true);
        settRedigeringsmodus(Redigeringsmodus.REDIGERING);
        const vilkår = await hentEnkeltInngangsvilkår(vurdering.behandlingId, vurdering.id);
        if (vilkår) {
            settVilkårGjenbruk(vilkår);
        }
        settPanelITilstand(vurdering.vilkårType, EkspandertTilstand.KAN_IKKE_LUKKES);
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

    const startRedigering = () => {
        settRedigeringsmodus(Redigeringsmodus.REDIGERING);
        settPanelITilstand(vurdering.vilkårType, EkspandertTilstand.KAN_IKKE_LUKKES);
    };

    switch (redigeringsmodus) {
        case Redigeringsmodus.IKKE_PÅSTARTET:
            return (
                <KnappWrapper>
                    <Knapp onClick={startRedigering} variant={'secondary'} type={'button'}>
                        {venstreKnappetekst ? venstreKnappetekst : 'Vurder vilkår'}
                    </Knapp>
                    <Button onClick={ikkeVurder} variant={'tertiary'} type={'button'}>
                        {høyreKnappetekst ? høyreKnappetekst : 'Ikke vurder vilkår'}
                    </Button>
                    <Button
                        onClick={hentResponsForEnkeltVilkår}
                        variant={'tertiary'}
                        type={'button'}
                    >
                        Gjenbruk
                    </Button>
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
                    skalGjenbruke={skalGjenbruke}
                    vilkårGjenbruk={vilkårGjenbruk}
                />
            );
        case Redigeringsmodus.VISNING:
            return (
                <VisVurdering
                    vurdering={vurdering}
                    startRedigering={startRedigering}
                    resetVurdering={resetVurdering}
                    feilmelding={feilmelding || resetFeilmelding}
                    behandlingErRedigerbar={behandlingErRedigerbar && erSaksbehandler}
                    tittelTekst={tittelTekstVisVurdering}
                    hentResponsForEnkeltVilkår={hentResponsForEnkeltVilkår}
                />
            );
    }
};
export default VisEllerEndreVurdering;
