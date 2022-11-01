import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import Brukerinfo from './Brukerinfo';
import { Sidetittel } from 'nav-frontend-typografi';
import DokumentVisning from './Dokumentvisning';
import { behandlingstemaTilTekst, Stønadstype } from '../../App/typer/behandlingstema';
import { Hovedknapp } from 'nav-frontend-knapper';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { useHentDokument } from '../../App/hooks/useHentDokument';
import { useHentFagsak } from '../../App/hooks/useHentFagsak';
import { useApp } from '../../App/context/AppContext';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../Oppgavebenk/oppgavefilterStorage';
import { IJojurnalpostResponse } from '../../App/typer/journalføring';
import { VelgFagsakForIkkeSøknad } from './VelgFagsakForIkkeSøknad';
import { AlertError } from '../../Felles/Visningskomponenter/Alerts';
import { harTittelForAlleDokumenter } from './journalføringUtil';
import JournalføringWrapper, {
    FlexKnapper,
    Høyrekolonne,
    JournalføringAppProps,
    Kolonner,
    SideLayout,
    Venstrekolonne,
} from './JournalføringWrapper';
import JournalføringPdfVisning from './JournalføringPdfVisning';
import {
    JournalføringKlageStateRequest,
    useJournalføringKlageState,
} from '../../App/hooks/useJournalføringKlageState';
import { useHentKlagebehandlinger } from '../../App/hooks/useHentKlagebehandlinger';
import BehandlingKlageInnold from './BehandlingKlageInnold';
import { Klagebehandlinger } from '../../App/typer/klage';
import { Fagsak } from '../../App/typer/fagsak';

const validerJournalføringState = (
    journalResponse: IJojurnalpostResponse,
    journalpostState: JournalføringKlageStateRequest
): string | undefined => {
    if (!journalpostState.behandling) {
        return 'Du må velge en behandling for å journalføre';
    } else if (!harTittelForAlleDokumenter(journalResponse, journalpostState.dokumentTitler)) {
        return 'Mangler tittel på et eller flere dokumenter';
    } else if (journalResponse.journalpost.tema !== 'ENF') {
        return 'Tema på journalføringsoppgaven må endres til «Enslig forsørger» i Gosys før du kan journalføre dokumentet i EF Sak';
    } else {
        return undefined;
    }
};

export const JournalføringKlageApp: React.FC = () => {
    return <JournalføringWrapper komponent={JournalføringAppContent} />;
};

const utledValgtFagsak = (fagsak: Ressurs<Fagsak>): keyof Klagebehandlinger | undefined => {
    if (fagsak.status !== RessursStatus.SUKSESS) {
        return undefined;
    }
    switch (fagsak.data.stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return 'overgangsstønad';
        case Stønadstype.BARNETILSYN:
            return 'barnetilsyn';
        case Stønadstype.SKOLEPENGER:
            return 'skolepenger';
    }
};

const JournalføringAppContent: React.FC<JournalføringAppProps> = ({
    oppgaveId,
    journalResponse,
}) => {
    const { innloggetSaksbehandler } = useApp();
    const navigate = useNavigate();

    const journalpostId = journalResponse.journalpost.journalpostId;

    const journalpostState: JournalføringKlageStateRequest = useJournalføringKlageState(
        oppgaveId,
        journalpostId
    );
    const hentDokumentResponse = useHentDokument(journalResponse.journalpost);

    const { klagebehandlinger, hentKlagebehandlinger } = useHentKlagebehandlinger();

    const { hentFagsak, fagsak } = useHentFagsak();
    const [feilmelding, settFeilMeldning] = useState('');

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
            hentKlagebehandlinger(fagsak.data.fagsakPersonId);
        }
        // eslint-disable-next-line
    }, [fagsak]);

    const valgtFagsak = utledValgtFagsak(fagsak);

    return (
        <SideLayout className={'container'}>
            <Sidetittel>{`Registrere journalpost for klage ${
                journalResponse.journalpost.behandlingstema
                    ? ': ' + behandlingstemaTilTekst[journalResponse.journalpost.behandlingstema]
                    : ''
            }`}</Sidetittel>
            <Kolonner>
                <Venstrekolonne>
                    <VelgFagsakForIkkeSøknad
                        journalResponse={journalResponse}
                        hentFagsak={hentFagsak}
                    />
                    <Brukerinfo
                        navn={journalResponse.navn}
                        personIdent={journalResponse.personIdent}
                    />
                    <DokumentVisning
                        journalPost={journalResponse.journalpost}
                        hentDokument={hentDokumentResponse.hentDokument}
                        dokumentTitler={journalpostState.dokumentTitler}
                        settDokumentTitler={journalpostState.settDokumentTitler}
                        erPapirsøknad={!journalResponse.harStrukturertSøknad}
                    />
                    <SkjemaGruppe feil={feilmelding}>
                        <BehandlingKlageInnold
                            settBehandling={journalpostState.settBehandling}
                            behandling={journalpostState.behandling}
                            behandlinger={klagebehandlinger}
                            valgtFagsak={valgtFagsak}
                            settFeilmelding={settFeilMeldning}
                        />
                    </SkjemaGruppe>
                    {(journalpostState.innsending.status === RessursStatus.FEILET ||
                        journalpostState.innsending.status === RessursStatus.FUNKSJONELL_FEIL) && (
                        <AlertError>{journalpostState.innsending.frontendFeilmelding}</AlertError>
                    )}
                    <FlexKnapper>
                        <Link to="/oppgavebenk">Tilbake til oppgavebenk</Link>
                        <Hovedknapp
                            onClick={() => {
                                const feilmeldingFraValidering = validerJournalføringState(
                                    journalResponse,
                                    journalpostState
                                );
                                if (feilmeldingFraValidering) {
                                    settFeilMeldning(feilmeldingFraValidering);
                                } else {
                                    journalpostState.fullførJournalføring(
                                        innloggetSaksbehandler?.enhet || '9999',
                                        innloggetSaksbehandler?.navIdent
                                    );
                                }
                            }}
                            spinner={journalpostState.innsending.status === RessursStatus.HENTER}
                        >
                            Journalfør
                        </Hovedknapp>
                    </FlexKnapper>
                </Venstrekolonne>
                <Høyrekolonne>
                    <JournalføringPdfVisning hentDokumentResponse={hentDokumentResponse} />
                </Høyrekolonne>
            </Kolonner>
        </SideLayout>
    );
};
