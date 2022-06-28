import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import OppgaveTabell, { IOppgaverResponse } from './OppgaveTabell';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { IOppgaveRequest } from './typer/oppgaverequest';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { IMappe, tomMappeListe } from './typer/mappe';
import OppgaveFiltrering from './OppgaveFiltrering';
import { erProd } from '../../App/utils/miljø';
import { harTilgangTilRolle } from '../../App/utils/roller';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import styled from 'styled-components';

export type OppgaveRessurs = Ressurs<IOppgaverResponse>;
const InfoVisning = styled(AlertStripeInfo)`
    margin-top: 2rem;
    max-width: 60rem;
    .alertstripe__tekst {
        max-width: 60rem;
    }
`;

export const OppgavebenkApp: React.FC = () => {
    const { axiosRequest, appEnv, innloggetSaksbehandler } = useApp();
    const [oppgaveRessurs, settOppgaveRessurs] = useState<OppgaveRessurs>(byggTomRessurs());
    const [mapper, settMapper] = useState<IMappe[]>(tomMappeListe);
    const [feilmelding, settFeilmelding] = useState<string>('');

    const hentOppgaver = useCallback(
        (data: IOppgaveRequest) => {
            axiosRequest<IOppgaverResponse, IOppgaveRequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/oppgave/soek`,
                data,
            }).then((res: Ressurs<IOppgaverResponse>) => settOppgaveRessurs(res));
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
    const harTilgangTilOppgavebenk = harTilgangTilRolle(
        appEnv,
        innloggetSaksbehandler,
        'saksbehandler'
    );

    if (!harTilgangTilOppgavebenk) {
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
                <OppgaveTabell
                    oppgaveRessurs={oppgaveRessurs}
                    mapper={mapper}
                    settFeilmelding={settFeilmelding}
                />
            </Side>
        );
    }
};
