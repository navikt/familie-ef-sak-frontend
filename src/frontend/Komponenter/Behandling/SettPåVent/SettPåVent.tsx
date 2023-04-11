import React, { FC, useCallback, useEffect, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { Alert, Button, Heading, Textarea } from '@navikt/ds-react';
import styled from 'styled-components';
import { ABgSubtle } from '@navikt/ds-tokens/dist/tokens';
import { ToggleName } from '../../../App/context/toggles';
import { useToggles } from '../../../App/context/TogglesContext';
import { IOppgave } from '../../Oppgavebenk/typer/oppgave';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Prioritet } from '../../Oppgavebenk/typer/oppgavetema';
import { FristVelger } from './FristVelger';
import { MappeVelger } from './MappeVelger';
import { SaksbehandlerVelger } from './SaksbehandlerVelger';
import { PrioritetVelger } from './PrioritetVelger';
import {
    BehandlingStatus,
    ETaAvVentStatus,
    TaAvVentStatus,
} from '../../../App/typer/behandlingstatus';
import { Behandling } from '../../../App/typer/fagsak';
import { TaAvVentModal } from './TaAvVentModal';
import { EToast } from '../../../App/typer/toast';
import { EksisterendeBeskrivelse } from './EksisterendeBeskrivelse';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const OppgaveValg = styled.div`
    display: flex;
    gap: 1rem;
`;

const SettPåVentWrapper = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    background-color: ${ABgSubtle};
    padding: 2rem;
`;

const KnappeWrapper = styled.div`
    display: flex;
    gap: 2rem;
    justify-content: flex-end;
    margin-right: 15%;
`;

const FlexColumnDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Beskrivelse = styled(Textarea)`
    max-width: 60rem;
`;

type SettPåVentRequest = {
    oppgaveId: number;
    saksbehandler: string;
    prioritet: Prioritet;
    frist: string;
    mappe: string | undefined;
    beskrivelse: string | undefined;
    oppgaveVersjon: number;
};

export const SettPåVent: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const erBehandlingPåVent = behandling.status === BehandlingStatus.SATT_PÅ_VENT;
    const { visSettPåVent, settVisSettPåVent, hentBehandling } = useBehandling();
    const { toggles } = useToggles();
    const { axiosRequest, settToast } = useApp();

    const [oppgave, settOppgave] = useState<Ressurs<IOppgave>>(byggTomRessurs());
    const [taAvVentStatus, settTaAvVentStatus] = useState<ETaAvVentStatus>();
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    // Oppgavefelter
    const [saksbehandler, settSaksbehandler] = useState<string>('');
    const [prioritet, settPrioritet] = useState<Prioritet | undefined>();
    const [frist, settFrist] = useState<string | undefined>();
    const [mappe, settMappe] = useState<number | undefined>();
    const [beskrivelse, settBeskrivelse] = useState('');

    const lukkSettPåVent = () => {
        settFeilmelding('');
        settVisSettPåVent(false);
    };

    const hentOppgaveForBehandling = useCallback(() => {
        axiosRequest<IOppgave, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/behandling/${behandling.id}`,
        }).then(settOppgave);
    }, [behandling.id, axiosRequest]);

    useEffect(() => {
        if (oppgave.status === RessursStatus.SUKSESS) {
            settSaksbehandler(oppgave.data.tilordnetRessurs || '');
            settPrioritet(oppgave.data.prioritet || 'NORM');
            settFrist(oppgave.data.fristFerdigstillelse);
            settMappe(oppgave.data.mappeId);
        }
    }, [oppgave]);

    useEffect(() => {
        if (visSettPåVent) {
            hentOppgaveForBehandling();
        }
    }, [visSettPåVent, hentOppgaveForBehandling]);

    const taAvVent = () => {
        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/aktiver`,
        }).then((respons: RessursFeilet | RessursSuksess<string>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
                settToast(EToast.BEHANDLING_TATT_AV_VENT);
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
    };

    const håndterFortsettBehandling = () => {
        axiosRequest<TaAvVentStatus, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/kan-ta-av-vent`,
        }).then((respons: RessursFeilet | RessursSuksess<TaAvVentStatus>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                respons.data.status === ETaAvVentStatus.OK
                    ? taAvVent()
                    : settTaAvVentStatus(respons.data.status);
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
    };
    const settPåVent = () => {
        const kanSettePåVent = prioritet && frist;

        if (låsKnapp || !kanSettePåVent) {
            return;
        }

        settLåsKnapp(true);

        if (oppgave.status !== RessursStatus.SUKSESS || !oppgave.data.versjon || !oppgave.data.id) {
            settFeilmelding(
                'Teknisk feil. Mangler versjonsnumer for oppgave. Kontakt brukerstøtte'
            );
            return;
        }

        axiosRequest<string, SettPåVentRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/vent`,
            data: {
                saksbehandler,
                prioritet,
                frist,
                mappe: mappe?.toString(),
                beskrivelse,
                oppgaveVersjon: oppgave.data.versjon,
                oppgaveId: oppgave.data.id,
            },
        })
            .then((respons: RessursFeilet | RessursSuksess<string>) => {
                if (respons.status == RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    lukkSettPåVent();
                    nullstillOppgaveFelter();
                    settToast(EToast.BEHANDLING_SATT_PÅ_VENT);
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            })
            .finally(() => settLåsKnapp(false));
    };

    const nullstillOppgaveFelter = () => {
        settSaksbehandler('');
        settBeskrivelse('');
        settPrioritet(undefined);
        settFrist(undefined);
        settMappe(undefined);
    };

    return visSettPåVent && toggles[ToggleName.settPåVentMedOppgavestyring] ? (
        <DataViewer response={{ oppgave }}>
            {({ oppgave }) => {
                return (
                    <SettPåVentWrapper>
                        {erBehandlingPåVent ? (
                            <Heading size={'medium'}>Behandling på vent</Heading>
                        ) : (
                            <Heading size={'medium'}>Sett behandling på vent</Heading>
                        )}
                        <FlexColumnDiv>
                            <OppgaveValg>
                                <SaksbehandlerVelger
                                    oppgave={oppgave}
                                    saksbehandler={saksbehandler}
                                    settSaksbehandler={settSaksbehandler}
                                    erLesevisning={erBehandlingPåVent}
                                />
                                <PrioritetVelger
                                    prioritet={prioritet}
                                    settPrioritet={settPrioritet}
                                    erLesevisning={erBehandlingPåVent}
                                />
                                <FristVelger
                                    oppgave={oppgave}
                                    settFrist={settFrist}
                                    erLesevisning={erBehandlingPåVent}
                                />
                                <MappeVelger
                                    oppgaveEnhet={oppgave.tildeltEnhetsnr}
                                    settMappe={settMappe}
                                    valgtMappe={mappe}
                                    erLesevisning={erBehandlingPåVent}
                                />
                            </OppgaveValg>
                            <EksisterendeBeskrivelse beskrivelse={oppgave.beskrivelse} />
                            {!erBehandlingPåVent && (
                                <Beskrivelse
                                    label={'Beskrivelse'}
                                    size={'small'}
                                    value={beskrivelse}
                                    onChange={(e) => settBeskrivelse(e.target.value)}
                                />
                            )}
                        </FlexColumnDiv>
                        <KnappeWrapper>
                            {!erBehandlingPåVent && (
                                <Button
                                    onClick={() => settVisSettPåVent(false)}
                                    type={'button'}
                                    variant={'tertiary'}
                                >
                                    Avbryt
                                </Button>
                            )}
                            {!erBehandlingPåVent && (
                                <Button onClick={settPåVent} type={'button'} disabled={låsKnapp}>
                                    Sett på vent
                                </Button>
                            )}
                            {erBehandlingPåVent && (
                                <Button onClick={håndterFortsettBehandling} type={'button'}>
                                    Ta av vent
                                </Button>
                            )}
                        </KnappeWrapper>
                        {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
                        <TaAvVentModal
                            behandlingId={behandling.id}
                            taAvVentStatus={taAvVentStatus}
                            nullstillTaAvVentStatus={() => settTaAvVentStatus(undefined)}
                        />
                    </SettPåVentWrapper>
                );
            }}
        </DataViewer>
    ) : null;
};
