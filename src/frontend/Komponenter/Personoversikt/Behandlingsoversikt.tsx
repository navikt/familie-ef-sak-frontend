import React, { useEffect, useState } from 'react';
import {
    Behandling,
    BehandlingResultat,
    behandlingResultatInkludertTilbakekrevingTilTekst,
    Fagsak,
} from '../../App/typer/fagsak';
import styled from 'styled-components';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
import { formatterEnumVerdi } from '../../App/utils/utils';
import { Link } from 'react-router-dom';
import { useSorteringState } from '../../App/hooks/felles/useSorteringState';
import SorteringsHeader from '../Oppgavebenk/OppgaveSorteringHeader';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { PartialRecord } from '../../App/typer/common';
import { ToggleName } from '../../App/context/toggles';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useToggles } from '../../App/context/TogglesContext';
import { Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { EtikettInfo } from 'nav-frontend-etiketter';
import RevurderingModal from './RevurderingModal';
import Alertstripe from 'nav-frontend-alertstriper';
import {
    TilbakekrevingBehandling,
    TilbakekrevingBehandlingsresultatstype,
    TilbakekrevingBehandlingstype,
} from '../../App/typer/tilbakekreving';
import { lagTilbakekrevingslenke } from './TilbakekrevingBehandlingerTabell';

const StyledTable = styled.table`
    width: 40%;
    padding: 2rem;
    margin-left: 1rem;
`;

const KnappMedMargin = styled(Knapp)`
    margin-top: 1rem;
    margin-right: 1rem;
`;

const StyledEtikettInfo = styled(EtikettInfo)`
    margin-left: 1rem;
`;

const TittelLinje = styled.div`
    margin-top: 1.5rem;
    display: flex;
    align-items: flex-start;
`;

export enum BehandlingApplikasjon {
    EF_SAK = 'EF_SAK',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

const Behandlingsoversikt: React.FC<{ fagsakId: string }> = ({ fagsakId }) => {
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());
    const [tekniskOpphørFeilet, settTekniskOpphørFeilet] = useState<boolean>(false);
    const [kanStarteRevurdering, settKanStarteRevurdering] = useState<boolean>(false);
    const [visRevurderingvalg, settVisRevurderingvalg] = useState<boolean>(false);
    const [feilFagsakHenting, settFeilFagsakHenting] = useState<string>();
    const [tilbakekrevingBehandlinger, settTilbakekrevingbehandlinger] = useState<
        Ressurs<TilbakekrevingBehandling[]>
    >(byggTomRessurs());
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();

    const hentFagsak = () =>
        axiosRequest<Fagsak, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
        }).then((respons: RessursSuksess<Fagsak> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settFagsak(respons);
            } else {
                settFeilFagsakHenting(respons.frontendFeilmelding);
            }
        });

    const hentTilbakekrevingBehandlinger = () =>
        axiosRequest<TilbakekrevingBehandling[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/tilbakekreving/behandlinger/${fagsakId}`,
        }).then((response) => settTilbakekrevingbehandlinger(response));

    const gjørTekniskOpphør = () => {
        axiosRequest<void, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/tekniskopphor/${fagsakId}`,
        }).then((response: RessursSuksess<void> | RessursFeilet) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentFagsak();
            } else {
                settTekniskOpphørFeilet(true);
            }
        });
    };

    useEffect(() => {
        if (fagsakId) {
            hentFagsak();
            hentTilbakekrevingBehandlinger();
        }
        // eslint-disable-next-line
    }, [fagsakId]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            settKanStarteRevurdering(erAlleBehandlingerErFerdigstilt(fagsak.data));
        }
        // eslint-disable-next-line
    }, [fagsak]);

    function erAlleBehandlingerErFerdigstilt(fagsak: Fagsak) {
        return (
            fagsak.behandlinger.length > 0 &&
            fagsak.behandlinger.find(
                (behandling) => behandling.status !== BehandlingStatus.FERDIGSTILT
            ) === undefined
        );
    }

    return (
        <DataViewer response={{ fagsak, tilbakekrevingBehandlinger }}>
            {({ fagsak, tilbakekrevingBehandlinger }) => (
                <>
                    <TittelLinje>
                        <Systemtittel tag="h3">
                            Fagsak: {formatterEnumVerdi(fagsak.stønadstype)}
                        </Systemtittel>
                        {feilFagsakHenting && (
                            <Alertstripe type="feil">Kunne ikke hente fagsak</Alertstripe>
                        )}

                        {fagsak.erLøpende && <StyledEtikettInfo mini>Løpende</StyledEtikettInfo>}
                    </TittelLinje>
                    <BehandlingsoversiktTabell
                        behandlinger={fagsak.behandlinger}
                        eksternFagsakId={fagsak.eksternId}
                        tilbakekrevingBehandlinger={tilbakekrevingBehandlinger}
                    />
                    {kanStarteRevurdering && (
                        <KnappMedMargin onClick={() => settVisRevurderingvalg(true)}>
                            Opprett ny behandling
                        </KnappMedMargin>
                    )}
                    <RevurderingModal
                        visModal={visRevurderingvalg}
                        settVisModal={settVisRevurderingvalg}
                        fagsakId={fagsakId}
                    />
                    {toggles[ToggleName.TEKNISK_OPPHØR] && (
                        <KnappMedMargin onClick={() => gjørTekniskOpphør()}>
                            Teknisk opphør
                        </KnappMedMargin>
                    )}
                    {tekniskOpphørFeilet && (
                        <AlertStripeFeil style={{ maxWidth: '15rem' }}>
                            Kan ikke iverksette teknisk opphør
                        </AlertStripeFeil>
                    )}
                </>
            )}
        </DataViewer>
    );
};

const TabellData: PartialRecord<keyof Behandling | 'vedtaksdato', string> = {
    opprettet: 'Behandling opprettetdato',
    type: 'Type',
    status: 'Status',
    vedtaksdato: 'Vedtaksdato',
    resultat: 'Resultat',
};

interface GenerellBehandling {
    id: string;
    type: Behandlingstype | TilbakekrevingBehandlingstype;
    status: string;
    vedtaksdato?: string;
    resultat?: BehandlingResultat | TilbakekrevingBehandlingsresultatstype;
    opprettet: string;
    applikasjon: string;
}

const BehandlingsoversiktTabell: React.FC<{
    behandlinger: Behandling[];
    eksternFagsakId: number;
    tilbakekrevingBehandlinger: TilbakekrevingBehandling[];
}> = ({ behandlinger, eksternFagsakId, tilbakekrevingBehandlinger }) => {
    const generelleBehandlinger: GenerellBehandling[] = behandlinger.map((behandling) => {
        return {
            id: behandling.id,
            type: behandling.type,
            status: behandling.status,
            resultat: behandling.resultat,
            opprettet: behandling.opprettet,
            applikasjon: BehandlingApplikasjon.EF_SAK,
        };
    });

    const generelleTilbakekrevingBehandlinger: GenerellBehandling[] =
        tilbakekrevingBehandlinger.map((tilbakekrevingBehandling) => {
            return {
                id: tilbakekrevingBehandling.behandlingId,
                type: tilbakekrevingBehandling.type,
                status: tilbakekrevingBehandling.status,
                vedtaksdato: tilbakekrevingBehandling.vedtaksdato,
                resultat: tilbakekrevingBehandling.resultat,
                opprettet: tilbakekrevingBehandling.opprettetTidspunkt,
                applikasjon: BehandlingApplikasjon.TILBAKEKREVING,
            };
        });

    const alleBehandlinger = generelleBehandlinger.concat(generelleTilbakekrevingBehandlinger);

    const { sortertListe, settSortering, sortConfig } = useSorteringState<GenerellBehandling>(
        alleBehandlinger,
        {
            sorteringsfelt: 'opprettet',
            rekkefolge: 'descending',
        }
    );

    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    {Object.entries(TabellData).map(([felt, tekst], index) => (
                        <SorteringsHeader
                            rekkefolge={
                                sortConfig?.sorteringsfelt === felt
                                    ? sortConfig?.rekkefolge
                                    : undefined
                            }
                            tekst={tekst}
                            onClick={() => settSortering(felt as keyof GenerellBehandling)}
                            key={`${index}${felt}`}
                        />
                    ))}
                </tr>
            </thead>
            <tbody>
                {sortertListe.map((behandling) => {
                    return (
                        <tr key={behandling.id}>
                            <td>{formaterIsoDatoTid(behandling.opprettet)}</td>
                            <td>{formatterEnumVerdi(behandling.type)}</td>
                            <td>{formatterEnumVerdi(behandling.status)}</td>
                            <td>
                                {behandling.vedtaksdato &&
                                    formaterIsoDatoTid(behandling.vedtaksdato)}
                            </td>
                            <td>
                                {behandling.type === Behandlingstype.TEKNISK_OPPHØR &&
                                behandling.resultat ? (
                                    <span>{formatterEnumVerdi(behandling.resultat)}</span>
                                ) : behandling.applikasjon === BehandlingApplikasjon.EF_SAK ? (
                                    <Link
                                        className="lenke"
                                        to={{ pathname: `/behandling/${behandling.id}` }}
                                    >
                                        {behandling.resultat &&
                                            behandlingResultatInkludertTilbakekrevingTilTekst[
                                                behandling.resultat
                                            ]}
                                    </Link>
                                ) : (
                                    <td>
                                        <a
                                            target="_blank"
                                            rel="noreferrer"
                                            href={lagTilbakekrevingslenke(
                                                eksternFagsakId,
                                                behandling.id
                                            )}
                                        >
                                            {behandling.resultat
                                                ? behandlingResultatInkludertTilbakekrevingTilTekst[
                                                      behandling.resultat
                                                  ]
                                                : 'Ikke satt'}
                                        </a>
                                    </td>
                                )}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </StyledTable>
    );
};

export default Behandlingsoversikt;
