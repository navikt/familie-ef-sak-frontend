import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import OppgaveTabell, { IOppgaverResponse } from './OppgaveTabell';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { IOppgaveRequest } from './typer/oppgaverequest';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { IMappe, tomMappeListe } from './typer/mappe';
import OppgaveFiltrering from './OppgaveFiltrering';
import { erProd } from '../../App/utils/miljø';
import styled from 'styled-components';
import { AlertInfo } from '../../Felles/Visningskomponenter/Alerts';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { IOppgave } from './typer/oppgave';

const InfoVisning = styled(AlertInfo)`
    margin-top: 2rem;
    max-width: 60rem;

    .navds-alert__wrapper {
        max-width: 60rem;
    }
`;

const TabellContainer = styled.div`
    margin-top: 1rem;
`;

export const OppgavebenkApp: React.FC = () => {
    const { axiosRequest, erSaksbehandler } = useApp();
    const [oppgaveRessurs, settOppgaveRessurs] = useState<Ressurs<IOppgaverResponse>>(
        byggTomRessurs()
    );

    const [oppgaveRespons, settOppgaveRespons] = useState<IOppgaverResponse>({
        antallTreffTotalt: 0,
        oppgaver: [],
    });
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
                if (res.status === RessursStatus.SUKSESS) {
                    settOppgaveRespons(res.data);
                }
            });
        },
        [axiosRequest]
    );

    const oppdaterOppgave = (oppgaveId: string) => {
        axiosRequest<IOppgave, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/oppslag/${oppgaveId}`,
        }).then((res: RessursSuksess<IOppgave> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                settOppgaveRespons((prevState) => ({
                    ...prevState,
                    oppgaver: prevState.oppgaver.map((oppgave) => {
                        if (oppgave.id.toString() == oppgaveId) {
                            return res.data;
                        }
                        return oppgave;
                    }),
                }));
            } else {
                settFeilmelding(res.frontendFeilmelding);
            }
        });
    };

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

    if (!erSaksbehandler) {
        return (
            <Side className={'container'}>
                <InfoVisning>
                    Oppgavebenken er ikke tilgjengelig for veiledere. Benytt fødselsnummer i
                    søkefelt for å finne informasjon om en person
                </InfoVisning>
            </Side>
        );
    } else {
        return (
            <Side className={'container'}>
                {!erProd() && <OpprettDummyBehandling />}
                <OppgaveFiltrering
                    hentOppgaver={hentOppgaver}
                    mapper={mapper}
                    feilmelding={feilmelding}
                    settFeilmelding={settFeilmelding}
                />
                <TabellContainer>
                    <DataViewer response={{ oppgaveRessurs }}>
                        {() => (
                            <OppgaveTabell
                                oppgaveResponse={oppgaveRespons}
                                mapper={mapper}
                                settFeilmelding={settFeilmelding}
                                oppdaterOppgave={oppdaterOppgave}
                            />
                        )}
                    </DataViewer>
                </TabellContainer>
            </Side>
        );
    }
};
