import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { erAvTypeFeil, RessursStatus } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import Brukerinfo from '../Felles/Brukerinfo';
import DokumentVisning from '../Felles/Dokumentvisning';
import {
    JournalføringStateRequest,
    useJournalføringState,
} from '../../../App/hooks/useJournalføringState';
import { useHentDokument } from '../../../App/hooks/useHentDokument';
import { useHentFagsak } from '../../../App/hooks/useHentFagsak';
import { useApp } from '../../../App/context/AppContext';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../../Oppgavebenk/oppgavefilterStorage';
import BehandlingInnold from './Behandling';
import { UtledEllerVelgFagsak } from '../Felles/UtledEllerVelgFagsak';
import { BodyLong, Button, Fieldset, Heading } from '@navikt/ds-react';
import LeggTilBarnSomSkalFødes from '../../Behandling/Førstegangsbehandling/LeggTilBarnSomSkalFødes';
import VelgUstrukturertDokumentasjonType, {
    UstrukturertDokumentasjonType,
} from './VelgUstrukturertDokumentasjonType';
import { VelgFagsakForIkkeSøknad } from '../Felles/VelgFagsakForIkkeSøknad';
import EttersendingMedNyeBarn from './EttersendingMedNyeBarn';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { harValgtNyBehandling, utledKolonneTittel } from '../Felles/utils';
import JournalføringWrapper, {
    FlexKnapper,
    Høyrekolonne,
    JournalføringAppProps,
    Kolonner,
    Venstrekolonne,
} from '../Felles/JournalføringWrapper';
import JournalføringPdfVisning from '../Felles/JournalføringPdfVisning';
import JournalpostTittelOgLenke from '../Felles/JournalpostTittelOgLenke';
import { ÅpneKlager } from '../../Personoversikt/Klage/ÅpneKlager';
import { alleBehandlingerErFerdigstiltEllerSattPåVent } from '../../Personoversikt/utils';
import { validerJournalføringState } from '../Felles/JournalføringValidering';

const ModalTekst = styled(BodyLong)`
    margin-top: 2rem;
`;

export const JournalføringAppNy: React.FC = () => {
    return <JournalføringWrapper komponent={JournalføringAppContent} />;
};

const JournalføringAppContent: React.FC<JournalføringAppProps> = ({
    oppgaveId,
    journalResponse,
}) => {
    const { innloggetSaksbehandler } = useApp();
    const navigate = useNavigate();

    const journalpostId = journalResponse.journalpost.journalpostId;

    const journalpostState: JournalføringStateRequest = useJournalføringState(
        oppgaveId,
        journalpostId
    );
    const hentDokumentResponse = useHentDokument(journalResponse.journalpost);

    const { hentFagsak, fagsak } = useHentFagsak();
    const [feilmelding, settFeilmelding] = useState('');

    useEffect(() => {
        if (journalpostState.innsending.status === RessursStatus.SUKSESS) {
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
    }, [innloggetSaksbehandler, journalResponse, journalpostState, navigate]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            journalpostState.settFagsakId(fagsak.data.id);
            settFeilmelding('');
        }
        // eslint-disable-next-line
    }, [fagsak]);

    const skalBeOmBekreftelse = (erNyBehandling: boolean) => {
        if (!erNyBehandling) {
            return journalResponse.harStrukturertSøknad || erPapirsøknad;
        } else {
            return false;
        }
    };

    const kanLeggeTilBarnSomSkalFødes = () => {
        const erNyBehandling =
            journalpostState.behandling &&
            journalpostState.behandling.behandlingstype &&
            !journalpostState.behandling.behandlingsId;
        const harIkkeStrukturertSøknad = !journalResponse.harStrukturertSøknad;
        return (
            erNyBehandling &&
            harIkkeStrukturertSøknad &&
            journalpostState.ustrukturertDokumentasjonType ===
                UstrukturertDokumentasjonType.PAPIRSØKNAD
        );
    };

    const skalVelgeVilkårsbehandleNyeBarn =
        journalpostState.ustrukturertDokumentasjonType ===
            UstrukturertDokumentasjonType.ETTERSENDING &&
        harValgtNyBehandling(journalpostState.behandling);

    const erPapirsøknad =
        journalpostState.ustrukturertDokumentasjonType ===
        UstrukturertDokumentasjonType.PAPIRSØKNAD;

    const journalFør = () => {
        settFeilmelding('');
        if (fagsak.status !== RessursStatus.SUKSESS) {
            settFeilmelding('Henting av fagsak feilet, relast siden');
            return;
        }
        const feilmeldingFraValidering = validerJournalføringState(
            journalResponse,
            journalpostState,
            alleBehandlingerErFerdigstiltEllerSattPåVent(fagsak.data)
        );
        if (feilmeldingFraValidering) {
            settFeilmelding(feilmeldingFraValidering);
        } else if (skalBeOmBekreftelse(harValgtNyBehandling(journalpostState.behandling))) {
            journalpostState.settVisBekreftelsesModal(true);
        } else {
            journalpostState.fullførJournalføring();
        }
    };

    return (
        <>
            <Kolonner>
                <Venstrekolonne>
                    <Heading size={'medium'} level={'1'}>
                        {utledKolonneTittel(journalResponse.journalpost.behandlingstema, 'vanlig')}
                    </Heading>
                    <Heading size={'medium'} level={'1'}>
                        Journalfør
                    </Heading>
                    {fagsak.status === RessursStatus.SUKSESS && (
                        <ÅpneKlager fagsakPersonId={fagsak.data.fagsakPersonId} />
                    )}
                    <JournalpostTittelOgLenke
                        journalResponse={journalResponse}
                        oppgaveId={oppgaveId}
                        fra={'vanlig'}
                    />
                    {!journalResponse.harStrukturertSøknad ? (
                        <>
                            <VelgFagsakForIkkeSøknad
                                journalResponse={journalResponse}
                                hentFagsak={hentFagsak}
                            />
                            <VelgUstrukturertDokumentasjonType
                                oppgaveId={oppgaveId}
                                ustrukturertDokumentasjonType={
                                    journalpostState.ustrukturertDokumentasjonType
                                }
                                settUstrukturertDokumentasjonType={
                                    journalpostState.settUstrukturertDokumentasjonType
                                }
                            />
                        </>
                    ) : (
                        <UtledEllerVelgFagsak
                            journalResponse={journalResponse}
                            hentFagsak={hentFagsak}
                        />
                    )}
                    <Brukerinfo
                        navn={journalResponse.navn}
                        personIdent={journalResponse.personIdent}
                    />
                    <DokumentVisning
                        journalPost={journalResponse.journalpost}
                        hentDokument={hentDokumentResponse.hentDokument}
                        dokumentTitler={journalpostState.dokumentTitler}
                        settDokumentTitler={journalpostState.settDokumentTitler}
                        erPapirsøknad={erPapirsøknad}
                    />
                    <Fieldset error={feilmelding} hideLegend legend={'Behandlingsvalg'}>
                        <BehandlingInnold
                            settBehandling={journalpostState.settBehandling}
                            behandling={journalpostState.behandling}
                            fagsak={fagsak}
                            settFeilmelding={settFeilmelding}
                        />
                        {kanLeggeTilBarnSomSkalFødes() && (
                            <LeggTilBarnSomSkalFødes
                                barnSomSkalFødes={journalpostState.barnSomSkalFødes}
                                oppdaterBarnSomSkalFødes={journalpostState.settBarnSomSkalFødes}
                            />
                        )}
                        {skalVelgeVilkårsbehandleNyeBarn &&
                            fagsak.status === RessursStatus.SUKSESS && (
                                <EttersendingMedNyeBarn
                                    fagsak={fagsak.data}
                                    vilkårsbehandleNyeBarn={journalpostState.vilkårsbehandleNyeBarn}
                                    settVilkårsbehandleNyeBarn={
                                        journalpostState.settVilkårsbehandleNyeBarn
                                    }
                                />
                            )}
                    </Fieldset>
                    {erAvTypeFeil(journalpostState.innsending) && (
                        <AlertError>{journalpostState.innsending.frontendFeilmelding}</AlertError>
                    )}
                    <FlexKnapper>
                        <Link to="/oppgavebenk">Tilbake til oppgavebenk</Link>
                        <Button type={'button'} onClick={() => journalFør()}>
                            Journalfør
                        </Button>
                    </FlexKnapper>
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
    return (
        <ModalWrapper
            tittel={''}
            visModal={journalpostState.visBekreftelsesModal}
            onClose={() => journalpostState.settVisBekreftelsesModal(false)}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => {
                        journalpostState.settVisBekreftelsesModal(false);
                        journalpostState.fullførJournalføring();
                    },
                    tekst: 'Journalfør allikevel',
                },
                lukkKnapp: {
                    onClick: () => journalpostState.settVisBekreftelsesModal(false),
                    tekst: 'Tilbake',
                },
            }}
            ariaLabel={'Bekreft journalføring av oppgave, eller avbryt'}
        >
            <ModalTekst>
                Journalposten har en søknad tilknyttet seg. Er du sikker på at du vil journalføre
                uten å lage en ny behandling?
            </ModalTekst>
        </ModalWrapper>
    );
};
