import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { erAvTypeFeil, RessursStatus } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import {
    Journalføringsaksjon,
    JournalføringStateRequest,
    useJournalføringState,
} from '../../../App/hooks/useJournalføringState';
import { useApp } from '../../../App/context/AppContext';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../../../App/utils/localStorage';
import { BodyShort, Heading, HStack } from '@navikt/ds-react';
import JournalføringWrapper, {
    Høyrekolonne,
    JournalføringSideProps,
    Kolonner,
    Venstrekolonne,
} from '../Felles/JournalføringWrapper';
import JournalføringPdfVisning from '../Felles/JournalføringPdfVisning';
import JournalpostPanel from './JournalpostPanel';
import AvsenderPanel from './AvsenderPanel';
import Dokumenter from './Dokumenter';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import Behandlinger from './Behandlinger';
import { Knapp } from '../../../Felles/Knapper/HovedKnapp';
import {
    journalføringGjelderKlage,
    Journalføringsårsak,
    skalViseBekreftelsesmodal,
} from '../Felles/utils';
import Klagebehandlinger from './Klagebehandlinger';
import { validerJournalføring } from '../Felles/journalføringValidering';
import NyeBarnPåBehandlingen from './NyeBarnPåBehandlingen';
import { KlageMottatt } from '../Klage/KlageMottatt';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { EToast } from '../../../App/typer/toast';
import { TerminBarnSkjema } from '../../Behandling/Førstegangsbehandling/TerminBarnSkjema';
import { BrukerPanel } from '../../../Felles/BrukerPanel/BrukerPanel';
import { PanelHeaderType } from '../../../Felles/BrukerPanel/PanelHeader';

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const Tittel = styled(Heading)`
    margin-bottom: 0.5rem;
`;

export const JournalføringSide: React.FC = () => {
    return <JournalføringWrapper komponent={Journalføring} />;
};

const Journalføring: React.FC<JournalføringSideProps> = ({
    oppgaveId,
    journalResponse,
    gjelderKlage,
}) => {
    const { innloggetSaksbehandler, settToast } = useApp();
    const navigate = useNavigate();
    const journalpostState: JournalføringStateRequest = useJournalføringState(
        journalResponse,
        oppgaveId,
        gjelderKlage
    );
    const {
        fagsak,
        fullførJournalføringV2,
        hentDokumentResponse,
        innsending,
        journalføringsaksjon,
        journalføringsårsak,
        settVisBekreftelsesModal,
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
            settToast(EToast.JOURNALFØRING_VELLYKKET);
            navigate('/oppgavebenk');
        }
    }, [innloggetSaksbehandler, journalResponse, innsending, navigate, settToast]);

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
            skalViseBekreftelsesmodal(
                journalResponse,
                journalføringsaksjon,
                erPapirSøknad,
                journalføringGjelderKlage(journalføringsårsak)
            )
        ) {
            settVisBekreftelsesModal(true);
        } else {
            fullførJournalføringV2();
        }
    };

    const kanLeggeTilTerminBarn = (journalpostState: JournalføringStateRequest) => {
        const erNyBehandling =
            journalpostState.journalføringsaksjon == Journalføringsaksjon.OPPRETT_BEHANDLING;
        const erPapirsøknad =
            journalpostState.journalføringsårsak === Journalføringsårsak.PAPIRSØKNAD;
        return erNyBehandling && erPapirsøknad;
    };

    const skalViseKlagebehandlinger = journalføringGjelderKlage(journalføringsårsak);
    const erPapirSøknad = journalføringsårsak === Journalføringsårsak.PAPIRSØKNAD;
    const senderInn = journalpostState.innsending.status == RessursStatus.HENTER;

    return (
        <>
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
                            <BrukerPanel
                                navn={journalResponse.navn}
                                personIdent={journalResponse.personIdent}
                                type={PanelHeaderType.Bruker}
                            />
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
                            {kanLeggeTilTerminBarn(journalpostState) && (
                                <TerminBarnSkjema
                                    barnSomSkalFødes={journalpostState.barnSomSkalFødes}
                                    oppdaterBarnSomSkalFødes={journalpostState.settBarnSomSkalFødes}
                                    tittel="Journalføre papirsøknad?"
                                    tekst="Hvis brukeren har oppgitt terminbarn i søknaden, må du legge til termindatoen her."
                                />
                            )}
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
                            <Knapp
                                size={'small'}
                                variant={'primary'}
                                onClick={validerOgJournalfør}
                                loading={senderInn}
                                disabled={senderInn}
                            >
                                Journalfør
                            </Knapp>
                        </HStack>
                    </InnerContainer>
                </Venstrekolonne>
                <Høyrekolonne>
                    <JournalføringPdfVisning hentDokumentResponse={hentDokumentResponse} />
                </Høyrekolonne>
            </Kolonner>
            <BekreftJournalføringModal journalpostState={journalpostState} />
        </>
    );
};

const BekreftJournalføringModal: React.FC<{
    journalpostState: JournalføringStateRequest;
}> = ({ journalpostState }) => {
    const senderInn = journalpostState.innsending.status == RessursStatus.HENTER;
    return (
        <ModalWrapper
            tittel={'Journalfør uten behandling'}
            visModal={journalpostState.visBekreftelsesModal}
            onClose={() => journalpostState.settVisBekreftelsesModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => {
                        journalpostState.settVisBekreftelsesModal(false);
                        journalpostState.fullførJournalføringV2();
                    },
                    loading: senderInn,
                    disabled: senderInn,
                    tekst: 'Journalfør allikevel',
                },
                lukkKnapp: {
                    onClick: () => journalpostState.settVisBekreftelsesModal(false),
                    tekst: 'Tilbake',
                },
            }}
            ariaLabel={'Bekreft journalføring av oppgave, eller avbryt'}
        >
            <BodyShort>
                Journalposten har en søknad tilknyttet seg. Er du sikker på at du vil journalføre
                uten å lage en ny behandling?
            </BodyShort>
        </ModalWrapper>
    );
};
