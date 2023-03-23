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
import { Alert, BodyLong, Button, Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { ABgSubtle } from '@navikt/ds-tokens/dist/tokens';
import { ToggleName } from '../../../App/context/toggles';
import { useToggles } from '../../../App/context/TogglesContext';
import { IOppgave } from '../../Oppgavebenk/typer/oppgave';
import DataViewer from '../../../Felles/DataViewer/DataViewer';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const OppgaveValg = styled.div`
    display: flex;
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

export const SettPåVent: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { visSettPåVent, settVisSettPåVent, hentBehandling } = useBehandling();
    const [oppgave, settOppgave] = useState<Ressurs<IOppgave>>(byggTomRessurs());
    const { toggles } = useToggles();
    const { axiosRequest, innloggetSaksbehandler } = useApp();

    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    // Oppgavefelter
    const [saksbehandler, settSaksbehandler] = useState<string>('');
    // const [frist, settFrist] = useState<string | undefined>();
    // const [mappe, settMappe] = useState<string | undefined>();
    // const [prioritet, settPrioritet] = useState<string | undefined>();
    // const [beskrivelse, settBeskrivelse] = useState<string | undefined>();

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
        }
    }, [oppgave]);
    useEffect(() => {
        if (visSettPåVent) {
            hentOppgaveForBehandling();
        }
    }, [visSettPåVent, hentOppgaveForBehandling]);

    const settPåVent = () => {
        if (låsKnapp) {
            return;
        }

        settLåsKnapp(true);

        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/vent`,
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
                    <OppgaveValg>
                        <div>
                            <Select
                                label={'Saksbehandler'}
                                size={'small'}
                                value={saksbehandler}
                                onChange={(e) => {
                                    settSaksbehandler(e.target.value);
                                }}
                            >
                                {oppgave.tilordnetRessurs &&
                                    innloggetSaksbehandler.navIdent !==
                                        oppgave.tilordnetRessurs && (
                                        <option value={oppgave.tilordnetRessurs}>
                                            {oppgave.tilordnetRessurs}
                                        </option>
                                    )}
                                <option value={innloggetSaksbehandler.navIdent}>
                                    {innloggetSaksbehandler.displayName}
                                </option>
                                <option value={''}>Ingen</option>
                            </Select>
                        </div>
                        {/*<Prioritet></Prioritet>*/}
                        {/*<Frist></Frist>*/}
                        {/*<Enhetsmappe></Enhetsmappe>*/}
                    </OppgaveValg>
                    <BodyLong>
                        Behandlingen settes på vent, men du må inntil videre huske å oppdatere
                        oppgaven i Gosys i henhold til gjeldende rutiner.
                    </BodyLong>
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
