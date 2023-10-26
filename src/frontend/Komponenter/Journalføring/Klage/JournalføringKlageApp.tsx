import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { erAvTypeFeil, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import Brukerinfo from '../Felles/Brukerinfo';
import DokumentVisning from '../Felles/Dokumentvisning';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { useHentDokument } from '../../../App/hooks/useHentDokument';
import { useHentFagsak } from '../../../App/hooks/useHentFagsak';
import { useApp } from '../../../App/context/AppContext';
import {
    hentFraLocalStorage,
    lagreTilLocalStorage,
    oppgaveRequestKey,
} from '../../Oppgavebenk/oppgavefilterStorage';
import { VelgFagsakForIkkeSøknad } from '../Felles/VelgFagsakForIkkeSøknad';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { harValgtNyKlageBehandling, utledKolonneTittel } from '../Felles/utils';
import JournalføringWrapper, {
    FlexKnapper,
    Høyrekolonne,
    JournalføringAppProps,
    Kolonner,
    SideLayout,
    Venstrekolonne,
} from '../Felles/JournalføringWrapper';
import JournalføringPdfVisning from '../Felles/JournalføringPdfVisning';
import {
    JournalføringKlageStateRequest,
    useJournalføringKlageState,
} from '../../../App/hooks/useJournalføringKlageState';
import { useHentKlagebehandlinger } from '../../../App/hooks/useHentKlagebehandlinger';
import BehandlingKlageInnold from './BehandlingKlageInnold';
import { Klagebehandlinger } from '../../../App/typer/klage';
import { Fagsak } from '../../../App/typer/fagsak';
import styled from 'styled-components';
import JournalpostTittelOgLenke from '../Felles/JournalpostTittelOgLenke';
import { Button, Fieldset, Heading } from '@navikt/ds-react';
import { ÅpneKlager } from '../../Personoversikt/Klage/ÅpneKlager';
import KlageGjelderTilbakekreving from '../../Personoversikt/Klage/KlageGjelderTilbakekreving';
import { Datovelger } from '../../../Felles/Datovelger/Datovelger';
import { validerJournalføringKlageState } from '../Felles/JournalføringValidering';

const KlageMottatt = styled.div`
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

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
            hentKlagebehandlinger(fagsak.data.fagsakPersonId);
        }
        // eslint-disable-next-line
    }, [fagsak]);

    const valgtFagsak = utledValgtFagsak(fagsak);

    const erNyBehandling = harValgtNyKlageBehandling(journalpostState.behandling);

    const journalFør = () => {
        const feilmeldingFraValidering = validerJournalføringKlageState(
            journalResponse,
            journalpostState
        );
        if (feilmeldingFraValidering) {
            settFeilmelding(feilmeldingFraValidering);
        } else {
            journalpostState.fullførJournalføring();
        }
    };

    return (
        <SideLayout className={'container'}>
            <Kolonner>
                <Venstrekolonne>
                    <Heading size={'medium'} level={'1'}>
                        {utledKolonneTittel(journalResponse.journalpost.behandlingstema, 'klage')}
                    </Heading>
                    {fagsak.status === RessursStatus.SUKSESS && (
                        <ÅpneKlager fagsakPersonId={fagsak.data.fagsakPersonId} />
                    )}
                    <JournalpostTittelOgLenke
                        journalResponse={journalResponse}
                        oppgaveId={oppgaveId}
                        fra={'klage'}
                    />
                    <VelgFagsakForIkkeSøknad
                        journalResponse={journalResponse}
                        hentFagsak={hentFagsak}
                    />
                    <KlageGjelderTilbakekreving
                        klageGjelderTilbakekreving={journalpostState.klageGjelderTilbakekreving}
                        settKlageGjelderTilbakekreving={
                            journalpostState.settKlageGjelderTilbakekreving
                        }
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
                    <Fieldset error={feilmelding} legend={'Klagevalg'} hideLegend>
                        <BehandlingKlageInnold
                            settBehandling={journalpostState.settBehandling}
                            behandling={journalpostState.behandling}
                            behandlinger={klagebehandlinger}
                            valgtFagsak={valgtFagsak}
                            settFeilmelding={settFeilmelding}
                        />
                        {erNyBehandling && (
                            <KlageMottatt>
                                <Datovelger
                                    id={'datoMottatt'}
                                    label={'Klage mottatt'}
                                    settVerdi={(mottattDato) => {
                                        journalpostState.settBehandling((prevState) => ({
                                            ...prevState,
                                            mottattDato,
                                        }));
                                    }}
                                    verdi={
                                        journalResponse.journalpost.datoMottatt
                                            ? journalResponse.journalpost.datoMottatt
                                            : journalpostState.behandling?.mottattDato
                                    }
                                    erLesevisning={!!journalResponse.journalpost.datoMottatt}
                                />
                            </KlageMottatt>
                        )}
                    </Fieldset>
                    {erAvTypeFeil(journalpostState.innsending) && (
                        <AlertError>{journalpostState.innsending.frontendFeilmelding}</AlertError>
                    )}
                    <FlexKnapper>
                        <Link to="/oppgavebenk">Tilbake til oppgavebenk</Link>
                        <Button
                            type="button"
                            onClick={journalFør}
                            loading={journalpostState.innsending.status === RessursStatus.HENTER}
                        >
                            Journalfør
                        </Button>
                    </FlexKnapper>
                </Venstrekolonne>
                <Høyrekolonne>
                    <JournalføringPdfVisning hentDokumentResponse={hentDokumentResponse} />
                </Høyrekolonne>
            </Kolonner>
        </SideLayout>
    );
};
