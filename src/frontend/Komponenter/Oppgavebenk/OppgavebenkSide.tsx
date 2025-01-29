import React, { useEffect, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import OppgaveTabell from './OppgaveTabell';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { IMappe, tomMappeListe } from './typer/mappe';
import OppgaveFiltrering from './OppgaveFiltrering';
import { erProd } from '../../App/utils/miljø';
import styled from 'styled-components';
import { AlertInfo } from '../../Felles/Visningskomponenter/Alerts';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { useHentOppgaver } from '../../App/hooks/useHentOppgaver';

const InfoStripe = styled(AlertInfo)`
    margin: 2rem;
    max-width: 60rem;
`;

const Container = styled.div`
    margin: 0.5rem;
`;

export const OppgavebenkSide: React.FC = () => {
    const { axiosRequest, erSaksbehandler } = useApp();
    const { hentOppgaver, oppgaver: oppgaveRessurs } = useHentOppgaver();

    const [mapper, settMapper] = useState<IMappe[]>(tomMappeListe);
    const [feilmelding, settFeilmelding] = useState<string>('');

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
                            antallTreffTotalt={oppgaveRessurs.antallTreffTotalt}
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
