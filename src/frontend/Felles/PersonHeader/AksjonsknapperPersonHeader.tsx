import React from 'react';
import { useBehandling } from '../../App/context/BehandlingContext';
import { Hamburgermeny } from '../Hamburgermeny/Hamburgermeny';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';
import { Behandling } from '../../App/typer/fagsak';
import { BehandlingStatus, erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';
import DataViewer from '../DataViewer/DataViewer';
import { AnsvarligSaksbehandlerRolle } from '../../App/typer/saksbehandler';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';

const StyledHamburgermeny = styled(Hamburgermeny)`
    margin-right: -1rem;
    margin-left: -1rem;
    padding-bottom: 0.4rem;
    @media screen and (min-width: 980px) {
        display: none;
    }
`;

const ButtonSmall = styled(Button)`
    width: max-content;
    block-size: fit-content;

    @media screen and (max-width: 979px) {
        display: none;
    }
`;

interface Props {
    behandling: Behandling;
    erSaksbehandler: boolean;
}

export const AksjonsknapperPersonHeader: React.FC<Props> = ({ erSaksbehandler, behandling }) => {
    const { ansvarligSaksbehandler, settVisHenleggModal, settVisSettPåVent } = useBehandling();
    const { toggles } = useToggles();

    const menyvalg = [
        {
            tekst: 'Henlegg',
            onClick: () => settVisHenleggModal(true),
        },
        {
            tekst: 'Sett på vent',
            onClick: () => settVisSettPåVent(true),
        },
    ];

    const sattPåVent = behandling.status === BehandlingStatus.SATT_PÅ_VENT;

    const gyldigeSaksbehandlerRoller = [
        AnsvarligSaksbehandlerRolle.IKKE_SATT,
        AnsvarligSaksbehandlerRolle.OPPGAVE_FINNES_IKKE,
        AnsvarligSaksbehandlerRolle.OPPGAVE_FINNES_IKKE_SANNSYNLIGVIS_INNLOGGET_SAKSBEHANDLER,
        AnsvarligSaksbehandlerRolle.INNLOGGET_SAKSBEHANDLER,
    ];

    const saksbehandlerKanRedigereBehandling = (rolle: AnsvarligSaksbehandlerRolle) =>
        gyldigeSaksbehandlerRoller.includes(rolle) ||
        (toggles[ToggleName.henleggBehandlingUtenÅHenleggeOppgave] &&
            rolle === AnsvarligSaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_ENF);

    return (
        <DataViewer response={{ ansvarligSaksbehandler }}>
            {({ ansvarligSaksbehandler }) => {
                if (
                    erSaksbehandler &&
                    (erBehandlingRedigerbar(behandling) || sattPåVent) &&
                    saksbehandlerKanRedigereBehandling(ansvarligSaksbehandler.rolle)
                ) {
                    return (
                        <>
                            {!sattPåVent && <StyledHamburgermeny items={menyvalg} />}
                            <ButtonSmall
                                disabled={sattPåVent}
                                onClick={() => settVisSettPåVent(true)}
                                size="xsmall"
                                variant="secondary"
                            >
                                Sett på vent
                            </ButtonSmall>
                            <ButtonSmall
                                disabled={sattPåVent}
                                onClick={() => settVisHenleggModal(true)}
                                size="xsmall"
                                variant="secondary"
                            >
                                Henlegg
                            </ButtonSmall>
                        </>
                    );
                }

                return <></>;
            }}
        </DataViewer>
    );
};
