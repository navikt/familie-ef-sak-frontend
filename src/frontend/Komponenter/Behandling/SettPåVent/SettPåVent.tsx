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
import { Alert, Button, Checkbox, CheckboxGroup, Heading, Textarea } from '@navikt/ds-react';
import styled from 'styled-components';
import { ADeepblue50 } from '@navikt/ds-tokens/dist/tokens';
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
import { Stønadstype } from '../../../App/typer/behandlingstema';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const OppgaveValg = styled.div`
    display: flex;
    gap: 3rem;
`;

const SettPåVentWrapper = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    background-color: ${ADeepblue50};
    padding: 2rem;
    gap: 1rem;
`;

const KnappeWrapper = styled.div`
    display: flex;
    gap: 2rem;
    justify-content: flex-end;
`;

const FlexColumnDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Beskrivelse = styled(Textarea)`
    max-width: 60rem;
`;

enum VurderHenvendelseOppgavetype {
    INFORMERE_OM_SØKT_OVERGANGSSTØNAD = 'INFORMERE_OM_SØKT_OVERGANGSSTØNAD',
    INNSTILLING_VEDRØRENDE_UTDANNING = 'INNSTILLING_VEDRØRENDE_UTDANNING',
}

const vurderHenvendelseOppgaveTilTekst: Record<VurderHenvendelseOppgavetype, string> = {
    INFORMERE_OM_SØKT_OVERGANGSSTØNAD: 'Beskjed om at vi har fått søknad',
    INNSTILLING_VEDRØRENDE_UTDANNING: 'Forespørsel om innstilling - utdanning',
};

type SettPåVentRequest = {
    oppgaveId: number;
    saksbehandler: string;
    prioritet: Prioritet;
    frist: string;
    mappe: string | undefined;
    beskrivelse: string | undefined;
    oppgaveVersjon: number;
    oppfølgingsoppgaverMotLokalKontor: VurderHenvendelseOppgavetype[];
};

type IOppgavestatus = {
    vurderHenvendelsOppgave: string;
    datoOpprettet: string;
};

export const SettPåVent: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const erBehandlingPåVent = behandling.status === BehandlingStatus.SATT_PÅ_VENT;
    const erOvergangsstønad = behandling.stønadstype === Stønadstype.OVERGANGSSTØNAD;
    const erOvergangsstønadEllerSkolepenger =
        erOvergangsstønad || behandling.stønadstype === Stønadstype.SKOLEPENGER;
    const { visSettPåVent, settVisSettPåVent, hentBehandling } = useBehandling();
    const { toggles } = useToggles();
    const { axiosRequest, settToast } = useApp();

    const [oppgave, settOppgave] = useState<Ressurs<IOppgave>>(byggTomRessurs<IOppgave>());
    const [oppgaverMotLokalkontor, settOppgaverMotLokalkontor] = useState<
        VurderHenvendelseOppgavetype[]
    >([]);
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

    const [oppgavestatus, settOppgavestatus] = useState<Ressurs<IOppgavestatus[]>>(
        byggTomRessurs<IOppgavestatus[]>()
    );

    const hentOppgavestatusForBehandling = useCallback(() => {
        axiosRequest<IOppgavestatus[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/behandling/${behandling.id}/settpavent-oppgavestatus`,
        }).then((respons: RessursSuksess<IOppgavestatus[]> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settOppgavestatus(respons);
            }
        });
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

    useEffect(() => {
        if (visSettPåVent) {
            hentOppgavestatusForBehandling();
        }
    }, [visSettPåVent, hentOppgavestatusForBehandling]);

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

        // if (oppgave.status !== RessursStatus.SUKSESS || !oppgave.data.versjon || !oppgave.data.id) {
        //     settFeilmelding(
        //         'Teknisk feil. Mangler versjonsnumer for oppgave. Kontakt brukerstøtte'
        //     );
        //     return;
        // }

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
                oppfølgingsoppgaverMotLokalKontor: oppgaverMotLokalkontor,
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
        settOppgaverMotLokalkontor([]);
    };

    const filtrerOppgavetyper = (oppgavetype: string) => {
        switch (oppgavetype) {
            case VurderHenvendelseOppgavetype.INFORMERE_OM_SØKT_OVERGANGSSTØNAD:
                return erOvergangsstønad;
            case VurderHenvendelseOppgavetype.INNSTILLING_VEDRØRENDE_UTDANNING:
                return erOvergangsstønadEllerSkolepenger;
            default:
                return true;
        }
    };

    const aktuelleOppgaver = Object.keys(VurderHenvendelseOppgavetype).filter((oppgavetype) =>
        filtrerOppgavetyper(oppgavetype)
    );

    const erSendt = (oppgave: VurderHenvendelseOppgavetype): boolean => {
        if (oppgavestatus.status === RessursStatus.SUKSESS) {
            return oppgavestatus.data.some((status) => status.vurderHenvendelsOppgave === oppgave);
        }
        return false;
    };

    const oppgaveSendtDato = (oppgave: VurderHenvendelseOppgavetype): string | undefined => {
        if (oppgavestatus.status !== RessursStatus.SUKSESS) {
            return undefined;
        }

        const matchedOppgaveStatus = oppgavestatus.data.find(
            (status) => status.vurderHenvendelsOppgave === oppgave
        );

        return matchedOppgaveStatus?.datoOpprettet
            ? ' (Oppgave sendt ' + matchedOppgaveStatus?.datoOpprettet + ')'
            : undefined;
    };

    return visSettPåVent && toggles[ToggleName.settPåVentMedOppgavestyring] ? (
        <DataViewer response={{ oppgave, oppgavestatus }}>
            {({ oppgave }) => {
                return (
                    <SettPåVentWrapper>
                        <Heading size={'medium'}>
                            {erBehandlingPåVent ? 'Behandling på vent' : 'Sett behandling på vent'}
                        </Heading>
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
                            {toggles[ToggleName.visVurderHenvendelseOppgaver] &&
                                erOvergangsstønadEllerSkolepenger &&
                                !erBehandlingPåVent && (
                                    <CheckboxGroup
                                        legend="Send oppgave til lokalkontoret"
                                        onChange={settOppgaverMotLokalkontor}
                                        size="small"
                                    >
                                        {aktuelleOppgaver.map((oppgave) => (
                                            <Checkbox
                                                disabled={erSendt(
                                                    oppgave as VurderHenvendelseOppgavetype
                                                )}
                                                key={oppgave}
                                                value={oppgave as VurderHenvendelseOppgavetype}
                                            >
                                                {
                                                    vurderHenvendelseOppgaveTilTekst[
                                                        oppgave as VurderHenvendelseOppgavetype
                                                    ]
                                                }
                                                {oppgaveSendtDato(
                                                    oppgave as VurderHenvendelseOppgavetype
                                                )}
                                            </Checkbox>
                                        ))}
                                    </CheckboxGroup>
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
