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
import { Alert, Button, Heading, Label, Textarea } from '@navikt/ds-react';
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
import { BreakWordBodyLongSmall } from '../../../Felles/Visningskomponenter/BreakWordBodyLongSmall';

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
    min-height: 30vh;
    max-height: 70vh;
`;

const KnappeWrapper = styled.div`
    display: flex;
    gap: 2rem;
    justify-content: flex-end;
    margin-right: 15%;
`;

const FlexDiv = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Beskrivelse = styled(Textarea)`
    max-width: 60rem;
`;

type SettPåVentRequest = {
    saksbehandler: string;
    prioritet: Prioritet;
    frist: string;
    mappe: string | undefined;
    beskrivelse: string | undefined;
};

export const SettPåVent: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { visSettPåVent, settVisSettPåVent, hentBehandling } = useBehandling();
    const [oppgave, settOppgave] = useState<Ressurs<IOppgave>>(byggTomRessurs());
    const { toggles } = useToggles();
    const { axiosRequest } = useApp();

    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    // Oppgavefelter
    const [saksbehandler, settSaksbehandler] = useState<string>('');
    const [prioritet, settPrioritet] = useState<Prioritet | undefined>();
    const [frist, settFrist] = useState<string | undefined>();
    const [mappe, settMappe] = useState<number | undefined>();

    const [beskrivelse, settBeskrivelse] = useState('');

    const lukkModal = () => {
        settFeilmelding('');
        settVisSettPåVent(false);
    };

    const hentOppgaveForBehandling = useCallback(() => {
        axiosRequest<IOppgave, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/behandling/${behandlingId}`,
        }).then(settOppgave);
    }, [behandlingId, axiosRequest]);

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

    const settPåVent = () => {
        const kanSettePåVent = saksbehandler && prioritet && frist;

        if (låsKnapp || !kanSettePåVent) {
            return;
        }

        settLåsKnapp(true);

        axiosRequest<string, SettPåVentRequest>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/vent`,
            data: {
                saksbehandler,
                prioritet,
                frist,
                mappe: mappe?.toString(),
                beskrivelse,
            },
        })
            .then((respons: RessursFeilet | RessursSuksess<string>) => {
                if (respons.status == RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    lukkModal();
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            })
            .finally(() => settLåsKnapp(false));
    };

    return visSettPåVent && toggles[ToggleName.settPåVentMedOppgavestyring] ? (
        <DataViewer response={{ oppgave }}>
            {({ oppgave }) => (
                <SettPåVentWrapper>
                    <Heading size={'medium'}>Sett behandling på vent</Heading>
                    <FlexDiv>
                        <OppgaveValg>
                            <SaksbehandlerVelger
                                oppgave={oppgave}
                                saksbehandler={saksbehandler}
                                settSaksbehandler={settSaksbehandler}
                            />
                            <PrioritetVelger prioritet={prioritet} settPrioritet={settPrioritet} />
                            <FristVelger oppgave={oppgave} settFrist={settFrist} />
                            <MappeVelger
                                oppgaveEnhet={oppgave.tildeltEnhetsnr}
                                settMappe={settMappe}
                                valgtMappe={mappe}
                            />
                        </OppgaveValg>
                        <section>
                            <Label size={'small'}>Beskrivelseshistorikk</Label>
                            <BreakWordBodyLongSmall>{oppgave.beskrivelse}</BreakWordBodyLongSmall>
                        </section>
                        <Beskrivelse
                            label={'Beskrivelse'}
                            size={'small'}
                            value={beskrivelse}
                            onChange={(e) => settBeskrivelse(e.target.value)}
                        />
                    </FlexDiv>
                    <KnappeWrapper>
                        <Button
                            onClick={() => settVisSettPåVent(false)}
                            type={'button'}
                            variant={'tertiary'}
                        >
                            Avbryt
                        </Button>
                        <Button onClick={settPåVent} type={'button'} disabled={låsKnapp}>
                            Sett på vent
                        </Button>
                    </KnappeWrapper>
                    {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
                </SettPåVentWrapper>
            )}
        </DataViewer>
    ) : null;
};
