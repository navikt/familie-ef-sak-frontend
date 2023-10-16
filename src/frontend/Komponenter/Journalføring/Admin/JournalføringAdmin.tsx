import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import Brukerinfo from '../Felles/Brukerinfo';
import { stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { useHentJournalpost } from '../../../App/hooks/useHentJournalpost';
import { useHentFagsak } from '../../../App/hooks/useHentFagsak';
import { useApp } from '../../../App/context/AppContext';
import { Behandlingstype, behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../../Oppgavebenk/oppgavefilterStorage';
import { IJournalpostResponse, journalstatusTilTekst } from '../../../App/typer/journalføring';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import { UtledEllerVelgFagsak } from '../Felles/UtledEllerVelgFagsak';
import { AlertError, AlertWarning } from '../../../Felles/Visningskomponenter/Alerts';
import { Button, Heading } from '@navikt/ds-react';
import { BodyLongSmall, BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { utledRiktigBehandlingstype } from '../Felles/utils';

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

export const JournalføringAdmin: React.FC = () => {
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

    const sendInn = (journalpostResponse: IJournalpostResponse, fagsakId: string) => {
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
        <>
            <DataViewer response={{ journalResponse }}>
                {({ journalResponse }) => (
                    <SideLayout>
                        <UtledEllerVelgFagsak
                            journalResponse={journalResponse}
                            hentFagsak={hentFagsak}
                        />
                    </SideLayout>
                )}
            </DataViewer>
            <DataViewer response={{ journalResponse, fagsak }}>
                {({ journalResponse, fagsak }) => (
                    <SideLayout className={'container'}>
                        <Heading size={'xlarge'} level={'1'}>
                            Opprett ny behandling for journalpost
                        </Heading>
                        <Blokk>
                            <BodyLongSmall>
                                Her kan du opprette en ny behandling med søknadsdata for en
                                journalpost som er ferdigstilt
                            </BodyLongSmall>
                        </Blokk>
                        <Blokk>
                            <Brukerinfo
                                navn={journalResponse.navn}
                                personIdent={journalResponse.personIdent}
                            />
                        </Blokk>
                        <Blokk>
                            <Heading size={'medium'} level={'2'}>
                                Journalpost
                            </Heading>
                            <BodyShortSmall>
                                {stønadstypeTilTekst[fagsak.stønadstype]}
                            </BodyShortSmall>
                            <BodyShortSmall>
                                JournalpostID: {journalResponse.journalpost.journalpostId}
                            </BodyShortSmall>
                            <BodyShortSmall>
                                Status:{' '}
                                {journalstatusTilTekst[journalResponse.journalpost.journalstatus]}
                            </BodyShortSmall>
                            <BodyShortSmall>
                                Dato mottatt:{' '}
                                {formaterIsoDatoTid(journalResponse.journalpost.datoMottatt)}
                            </BodyShortSmall>
                        </Blokk>
                        <Blokk>
                            <Heading size={'medium'} level={'2'}>
                                Behandlingstype
                            </Heading>
                            {nyBehandlingstype && (
                                <BodyShortSmall>
                                    {behandlingstypeTilTekst[nyBehandlingstype]}
                                </BodyShortSmall>
                            )}
                        </Blokk>

                        <Button
                            type="button"
                            onClick={() => sendInn(journalResponse, fagsak.id)}
                            loading={senderInn}
                        >
                            Opprett behandling
                        </Button>
                        {!journalResponse.harStrukturertSøknad && (
                            <AlertWarning>
                                Kan ikke finne en digital søknad på denne journalposten.
                            </AlertWarning>
                        )}
                        {feilmelding && <AlertError>{feilmelding}</AlertError>}
                    </SideLayout>
                )}
            </DataViewer>
        </>
    );
};
