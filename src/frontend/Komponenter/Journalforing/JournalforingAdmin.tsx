import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../App/typer/ressurs';
import styled from 'styled-components';
import Brukerinfo from './Brukerinfo';
import { Normaltekst, Sidetittel, Systemtittel } from 'nav-frontend-typografi';
import {
    behandlingstemaTilStønadstype,
    stønadstypeTilTekst,
} from '../../App/typer/behandlingstema';
import { Hovedknapp } from 'nav-frontend-knapper';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useHentJournalpost } from '../../App/hooks/useHentJournalpost';
import { useHentFagsak } from '../../App/hooks/useHentFagsak';
import { useApp } from '../../App/context/AppContext';
import { Behandlingstype, behandlingstypeTilTekst } from '../../App/typer/behandlingstype';
import { utledRiktigBehandlingstype } from './journalførBehandlingUtil';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../Oppgavebenk/oppgavefilterStorage';
import { IJojurnalpostResponse, journalstatusTilTekst } from '../../App/typer/journalforing';
import { formaterIsoDatoTid } from '../../App/utils/formatter';

const Blokk = styled.div`
    margin-bottom: 1rem;
    margin-top: 1rem;
`;
const SideLayout = styled.div`
    max-width: 50rem;
    padding: 2rem;
`;

type IJournalpostParams = {
    journalpostid: string;
};

export const JournalforingAdmin: React.FC = () => {
    const { journalpostid } = useParams<IJournalpostParams>();
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const navigate = useNavigate();
    const { hentJournalPost, journalResponse } = useHentJournalpost(journalpostid);
    const { hentFagsak, fagsak } = useHentFagsak();
    const [nyBehandlingstype, settNyBehandlingstype] = useState<Behandlingstype | undefined>();
    const [senderInn, settSenderInn] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>('');

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            settNyBehandlingstype(utledRiktigBehandlingstype(fagsak.data.behandlinger));
        }
    }, [fagsak]);

    useEffect(() => {
        if (journalResponse.status === RessursStatus.SUKSESS) {
            const stønadstype = behandlingstemaTilStønadstype(
                journalResponse.data.journalpost.behandlingstema
            );
            stønadstype && hentFagsak(journalResponse.data.personIdent, stønadstype);
        }
        // eslint-disable-next-line
    }, [journalResponse]);

    useEffect(() => {
        document.title = 'Journalpost';
        hentJournalPost();
    }, [hentJournalPost]);

    if (!journalpostid) {
        return <Navigate to="/oppgavebenk" />;
    }

    const gåTilOppgavebenkMedPersonSøk = (personIdent: string) => {
        const lagredeOppgaveFiltreringer = hentFraLocalStorage(
            oppgaveRequestKey(innloggetSaksbehandler.navIdent),
            {}
        );

        lagreTilLocalStorage(oppgaveRequestKey(innloggetSaksbehandler.navIdent), {
            ...lagredeOppgaveFiltreringer,
            ident: personIdent,
        });
        navigate('/oppgavebenk');
    };

    const sendInn = (journalpostResponse: IJojurnalpostResponse, fagsakId: string) => {
        settFeilmelding('');
        if (!nyBehandlingstype) {
            settFeilmelding('Har ikke fått satt riktig behandlingstype');
        } else if (!senderInn) {
            settSenderInn(true);
            axiosRequest<string, { fagsakId: string; behandlingstype: Behandlingstype }>({
                method: 'POST',
                url: `/familie-ef-sak/api/journalpost/${journalpostResponse.journalpost.journalpostId}/opprett-behandling-med-soknadsdata-fra-en-ferdigstilt-journalpost`,
                data: { fagsakId: fagsakId, behandlingstype: nyBehandlingstype },
            })
                .then((res: RessursSuksess<string> | RessursFeilet) => {
                    if (res.status === RessursStatus.SUKSESS) {
                        gåTilOppgavebenkMedPersonSøk(journalpostResponse.personIdent);
                    } else {
                        settFeilmelding(res.frontendFeilmelding);
                    }
                })
                .finally(() => {
                    settSenderInn(false);
                });
        }
    };

    return (
        <DataViewer response={{ journalResponse, fagsak }}>
            {({ journalResponse, fagsak }) => (
                <SideLayout className={'container'}>
                    <Sidetittel>Opprett ny behandling for journalpost</Sidetittel>
                    <Blokk>
                        <Normaltekst>
                            Her kan du opprette en ny behandling med søknadsdata for en journalpost
                            som er ferdigstilt
                        </Normaltekst>
                    </Blokk>
                    <Blokk>
                        <Brukerinfo personIdent={journalResponse.personIdent} />
                    </Blokk>
                    <Blokk>
                        <Systemtittel>Journalpost</Systemtittel>
                        <Normaltekst>{stønadstypeTilTekst[fagsak.stønadstype]}</Normaltekst>
                        <Normaltekst>
                            JournalpostID: {journalResponse.journalpost.journalpostId}
                        </Normaltekst>
                        <Normaltekst>
                            Status:{' '}
                            {journalstatusTilTekst[journalResponse.journalpost.journalstatus]}
                        </Normaltekst>
                        <Normaltekst>
                            Dato mottatt:{' '}
                            {formaterIsoDatoTid(journalResponse.journalpost.datoMottatt)}
                        </Normaltekst>
                    </Blokk>
                    <Blokk>
                        <Systemtittel>Behandlingstype</Systemtittel>
                        {nyBehandlingstype && (
                            <Normaltekst>{behandlingstypeTilTekst[nyBehandlingstype]}</Normaltekst>
                        )}
                    </Blokk>

                    <Hovedknapp
                        onClick={() => sendInn(journalResponse, fagsak.id)}
                        spinner={senderInn}
                    >
                        Opprett behandling
                    </Hovedknapp>
                    {!journalResponse.harStrukturertSøknad && (
                        <AlertStripeAdvarsel>
                            Kan ikke finne en digital søknad på denne journalposten.
                        </AlertStripeAdvarsel>
                    )}
                    {feilmelding && <AlertStripeFeil>{feilmelding}</AlertStripeFeil>}
                </SideLayout>
            )}
        </DataViewer>
    );
};
