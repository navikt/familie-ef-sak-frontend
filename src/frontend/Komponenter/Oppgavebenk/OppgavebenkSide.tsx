import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import OppgaveTabell, { IOppgaverResponse } from './OppgaveTabell';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { IOppgaveRequest } from './typer/oppgaverequest';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { IMappe, tomMappeListe } from './typer/mappe';
import OppgaveFiltrering from './OppgaveFiltrering';
import { erProd } from '../../App/utils/miljø';
import styled from 'styled-components';
import { AlertInfo } from '../../Felles/Visningskomponenter/Alerts';
import DataViewer from '../../Felles/DataViewer/DataViewer';

const InfoStripe = styled(AlertInfo)`
    margin: 2rem;
    max-width: 60rem;
`;

const Container = styled.div`
    margin: 0.5rem;
`;

export const OppgavebenkSide: React.FC = () => {
    const { axiosRequest, erSaksbehandler } = useApp();
    const [oppgaveRessurs, settOppgaveRessurs] =
        useState<Ressurs<IOppgaverResponse>>(byggTomRessurs());

    const [mapper, settMapper] = useState<IMappe[]>(tomMappeListe);
    const [feilmelding, settFeilmelding] = useState<string>('');

    const hentOppgaver = useCallback(
        (data: IOppgaveRequest) => {
            axiosRequest<IOppgaverResponse, IOppgaveRequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/oppgave/soek`,
                data,
            }).then((res: Ressurs<IOppgaverResponse>) => {
                settOppgaveRessurs(res);
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        axiosRequest<IMappe[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/mapper`,
        }).then((res: Ressurs<IMappe[]>) => {
            res.status === RessursStatus.SUKSESS && settMapper(res.data);
        });
    }, [axiosRequest]);

    useEffect(() => {
        document.title = 'Oppgavebenk';
    }, []);

    if (erSaksbehandler) {
        return (
            <Container>
                {!erProd() && <OpprettDummyBehandling />}
                <OppgaveFiltrering
                    hentOppgaver={hentOppgaver}
                    mapper={mapper}
                    feilmelding={feilmelding}
                    settFeilmelding={settFeilmelding}
                />
                <DataViewer response={{ oppgaveRessurs }}>
                    {({ oppgaveRessurs }) => (
                        <OppgaveTabell
                            oppgaver={oppgaveRessurs.oppgaver}
                            mapper={mapper}
                            settFeilmelding={settFeilmelding}
                        />
                    )}
                </DataViewer>
            </Container>
        );
    }

    return (
        <InfoStripe>
            Oppgavebenken er ikke tilgjengelig for veiledere. Benytt fødselsnummer i søkefelt for å
            finne informasjon om en person
        </InfoStripe>
    );
};
