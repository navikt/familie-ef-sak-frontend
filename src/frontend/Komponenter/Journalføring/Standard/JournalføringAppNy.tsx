import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { erAvTypeFeil, RessursStatus } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import {
    JournalføringStateRequest,
    useJournalføringState,
} from '../../../App/hooks/useJournalføringState';
import { useApp } from '../../../App/context/AppContext';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../../Oppgavebenk/oppgavefilterStorage';
import { Heading, HStack } from '@navikt/ds-react';
import JournalføringWrapper, {
    Høyrekolonne,
    JournalføringAppProps,
    Kolonner,
    Venstrekolonne,
} from '../Felles/JournalføringWrapper';
import JournalføringPdfVisning from '../Felles/JournalføringPdfVisning';
import JournalpostPanel from './JournalpostPanel';
import BrukerPanel from './BrukerPanel';
import AvsenderPanel from './AvsenderPanel';
import Dokumenter from './Dokumenter';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import Behandlinger from './Behandlinger';
import { Knapp } from '../../../Felles/Knapper/HovedKnapp';
import { journalføringGjelderKlage, skalViseBekreftelsesmodal } from '../Felles/utils';
import Klagebehandlinger from './Klagebehandlinger';
import { validerJournalføring } from '../Felles/journalføringValidering';
import { UstrukturertDokumentasjonType } from './VelgUstrukturertDokumentasjonType';
import BarnSomSkalFødes from './BarnSomSkalFødes';
import NyeBarnPåBehandlingen from './NyeBarnPåBehandlingen';
import { KlageMottatt } from '../Klage/KlageMottatt';

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const Tittel = styled(Heading)`
    margin-bottom: 0.5rem;
`;

export const JournalføringAppNy: React.FC = () => {
    return <JournalføringWrapper komponent={JournalføringSide} />;
};

const JournalføringSide: React.FC<JournalføringAppProps> = ({ oppgaveId, journalResponse }) => {
    const { innloggetSaksbehandler } = useApp();
    const navigate = useNavigate();
    const journalpostState: JournalføringStateRequest = useJournalføringState(
        journalResponse,
        oppgaveId
    );
    const {
        fagsak,
        fullførJournalføringV2,
        hentDokumentResponse,
        innsending,
        journalføringsaksjon,
        journalføringsårsak,
        settVisBekreftelsesModal,
        ustrukturertDokumentasjonType,
    } = journalpostState;

    const [feilmelding, settFeilmelding] = useState<string>('');

    useEffect(() => {
        if (erAvTypeFeil(innsending)) {
            settFeilmelding(innsending.frontendFeilmelding);
        }
    }, [innsending]);

    useEffect(() => {
        if (innsending.status === RessursStatus.SUKSESS) {
            const lagredeOppgaveFiltreringer = hentFraLocalStorage(
                oppgaveRequestKey(innloggetSaksbehandler.navIdent),
                {}
            );

            lagreTilLocalStorage(oppgaveRequestKey(innloggetSaksbehandler.navIdent), {
                ...lagredeOppgaveFiltreringer,
                ident: journalResponse.personIdent,
            });
            navigate('/oppgavebenk');
        }
    }, [innloggetSaksbehandler, journalResponse, innsending, navigate]);

    const validerOgJournalfør = () => {
        settFeilmelding('');
        if (fagsak.status !== RessursStatus.SUKSESS) {
            settFeilmelding('Henting av fagsak feilet. Last inn siden på nytt.');
            return;
        }
        const valideringsfeil = validerJournalføring(
            journalResponse,
            journalpostState,
            fagsak.data
        );

        if (valideringsfeil) {
            settFeilmelding(valideringsfeil);
        } else if (
            skalViseBekreftelsesmodal(journalResponse, journalføringsaksjon, erPapirSøknad)
        ) {
            settVisBekreftelsesModal(true);
        } else {
            fullførJournalføringV2();
        }
    };

    const skalViseKlagebehandlinger = journalføringGjelderKlage(journalføringsårsak);
    const erPapirSøknad =
        ustrukturertDokumentasjonType === UstrukturertDokumentasjonType.PAPIRSØKNAD;

    return (
        <Kolonner>
            <Venstrekolonne>
                <InnerContainer>
                    <section>
                        <Tittel size={'medium'} level={'1'}>
                            Journalføring
                        </Tittel>
                        <JournalpostPanel
                            journalpost={journalResponse.journalpost}
                            journalpostState={journalpostState}
                        />
                    </section>
                    <section>
                        <Tittel size={'small'} level={'2'}>
                            Dokumenter
                        </Tittel>
                        <Dokumenter
                            journalpost={journalResponse.journalpost}
                            journalpostState={journalpostState}
                        />
                    </section>
                    <section>
                        <Tittel size={'small'} level={'2'}>
                            Bruker
                        </Tittel>
                        <BrukerPanel journalpostResponse={journalResponse} />
                    </section>
                    <section>
                        <Tittel size={'small'} level={'2'}>
                            Avsender
                        </Tittel>
                        <AvsenderPanel
                            journalpostResponse={journalResponse}
                            journalpostState={journalpostState}
                        />
                    </section>
                    <section>
                        <Tittel size={'small'} level={'2'}>
                            Behandling
                        </Tittel>
                        {skalViseKlagebehandlinger ? (
                            <Klagebehandlinger
                                journalpostState={journalpostState}
                                settFeilmelding={settFeilmelding}
                            />
                        ) : (
                            <Behandlinger
                                journalpostState={journalpostState}
                                settFeilmelding={settFeilmelding}
                            />
                        )}
                    </section>
                    <section>
                        <BarnSomSkalFødes journalpostState={journalpostState} />
                        <NyeBarnPåBehandlingen journalpostState={journalpostState} />
                        <KlageMottatt
                            journalpostState={journalpostState}
                            journalResponse={journalResponse}
                        />
                    </section>
                    {feilmelding && <AlertError>{feilmelding}</AlertError>}
                    <HStack gap="4" justify="end">
                        <Knapp
                            size={'small'}
                            variant={'tertiary'}
                            onClick={() => navigate('/oppgavebenk')}
                        >
                            Avbryt
                        </Knapp>
                        <Knapp size={'small'} variant={'primary'} onClick={validerOgJournalfør}>
                            Journalfør
                        </Knapp>
                    </HStack>
                </InnerContainer>
            </Venstrekolonne>
            <Høyrekolonne>
                <JournalføringPdfVisning hentDokumentResponse={hentDokumentResponse} />
            </Høyrekolonne>
        </Kolonner>
    );
};
