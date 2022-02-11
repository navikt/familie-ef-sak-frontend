import React, { Dispatch, useEffect, useState } from 'react';
import {
    Behandling,
    BehandlingResultat,
    behandlingResultatInkludertTilbakekrevingTilTekst,
    Fagsak,
    IFagsakPerson,
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
import Alertstripe, { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useToggles } from '../../App/context/TogglesContext';
import { Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { EtikettInfo } from 'nav-frontend-etiketter';
import RevurderingModal from './RevurderingModal';
import {
    TilbakekrevingBehandling,
    TilbakekrevingBehandlingsresultatstype,
    TilbakekrevingBehandlingstype,
} from '../../App/typer/tilbakekreving';
import { tilbakekrevingBaseUrl } from '../../App/utils/miljø';
import { Behandlingsårsak, behandlingsårsakTilTekst } from '../../App/typer/Behandlingsårsak';
import { Stønadstype } from '../../App/typer/behandlingstema';

const StyledTable = styled.table`
    width: 50%;
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

const lagTilbakekrevingslenke = (eksternFagsakId: number, behandlingId: string): string => {
    return `${tilbakekrevingBaseUrl()}/fagsystem/EF/fagsak/${eksternFagsakId}/behandling/${behandlingId}`;
};

const Behandlingsoversikt: React.FC<{ fagsakPerson: IFagsakPerson }> = ({ fagsakPerson }) => {
    const [fagsakOvergangsstønad, settFagsakOvergangsstønad] = useState<Ressurs<Fagsak>>(
        byggTomRessurs()
    );
    const [fagsakBarnetilsyn, settFagsakBarnetilsyn] = useState<Ressurs<Fagsak>>(byggTomRessurs());
    const [fagsakSkolepenger, settFagsakSkolepenger] = useState<Ressurs<Fagsak>>(byggTomRessurs());

    const [tekniskOpphørFeilet, settTekniskOpphørFeilet] = useState<boolean>(false);
    const [kanStarteRevurdering, settKanStarteRevurdering] = useState<boolean>(false);
    const [visRevurderingvalg, settVisRevurderingvalg] = useState<boolean>(false);
    const [feilFagsakHenting, settFeilFagsakHenting] = useState<string>();
    const [tilbakekrevingBehandlinger, settTilbakekrevingbehandlinger] = useState<
        Ressurs<TilbakekrevingBehandling[]>
    >(byggTomRessurs());
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const {
        overgangsstønad: overgangsstønadId,
        barnetilsyn: barnetilsynId,
        skolepenger: skolepengerId,
    } = fagsakPerson;

    const hentFagsak = (fagsakId: string, settFagsak: Dispatch<Ressurs<Fagsak>>) =>
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
            url: `/familie-ef-sak/api/tilbakekreving/behandlinger/${overgangsstønadId}`,
        }).then((response) => settTilbakekrevingbehandlinger(response));

    const gjørTekniskOpphør = () => {
        axiosRequest<void, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/tekniskopphor/${overgangsstønadId}`,
        }).then((response: RessursSuksess<void> | RessursFeilet) => {
            if (response.status === RessursStatus.SUKSESS) {
                overgangsstønadId && hentFagsak(overgangsstønadId, settFagsakOvergangsstønad);
            } else {
                settTekniskOpphørFeilet(true);
            }
        });
    };

    useEffect(() => {
        if (overgangsstønadId) {
            hentFagsak(overgangsstønadId, settFagsakOvergangsstønad);
            hentTilbakekrevingBehandlinger();
        }
        if (barnetilsynId) {
            hentFagsak(barnetilsynId, settFagsakBarnetilsyn);
            // TODO: hentTilbakekrevingBehandlinger(barnetilsynId);
        }
        if (skolepengerId) {
            hentFagsak(skolepengerId, settFagsakSkolepenger);
            // TODO: hentTilbakekrevingBehandlinger(skolepengerId);
        }
        // eslint-disable-next-line
    }, [overgangsstønadId, barnetilsynId, skolepengerId]);

    useEffect(() => {
        if (fagsakOvergangsstønad.status === RessursStatus.SUKSESS) {
            settKanStarteRevurdering(erAlleBehandlingerErFerdigstilt(fagsakOvergangsstønad.data));
        }
        // eslint-disable-next-line
    }, [fagsakOvergangsstønad]);

    function erAlleBehandlingerErFerdigstilt(fagsak: Fagsak) {
        return (
            fagsak.behandlinger.length > 0 &&
            fagsak.behandlinger.find(
                (behandling) => behandling.status !== BehandlingStatus.FERDIGSTILT
            ) === undefined
        );
    }

    return (
        <DataViewer
            response={{
                fagsakOvergangsstønad,
                fagsakBarnetilsyn,
                tilbakekrevingBehandlinger,
            }}
        >
            {({ fagsakOvergangsstønad, fagsakBarnetilsyn, tilbakekrevingBehandlinger }) => (
                <>
                    {[fagsakOvergangsstønad, fagsakBarnetilsyn].map((fagsak) => {
                        return fagsak ? (
                            <>
                                <TittelLinje>
                                    <Systemtittel tag="h3">
                                        Fagsak: {formatterEnumVerdi(fagsak.stønadstype)}
                                    </Systemtittel>
                                    {feilFagsakHenting && (
                                        <Alertstripe type="feil">
                                            Kunne ikke hente fagsak
                                        </Alertstripe>
                                    )}

                                    {fagsak.erLøpende && (
                                        <StyledEtikettInfo mini>Løpende</StyledEtikettInfo>
                                    )}
                                </TittelLinje>
                                <BehandlingsoversiktTabell
                                    behandlinger={fagsak.behandlinger}
                                    eksternFagsakId={fagsak.eksternId}
                                    tilbakekrevingBehandlinger={tilbakekrevingBehandlinger}
                                />
                                {fagsak.stønadstype === Stønadstype.OVERGANGSSTØNAD &&
                                    kanStarteRevurdering && (
                                        <>
                                            <KnappMedMargin
                                                onClick={() => settVisRevurderingvalg(true)}
                                            >
                                                Opprett ny behandling
                                            </KnappMedMargin>
                                            <RevurderingModal
                                                visModal={visRevurderingvalg}
                                                settVisModal={settVisRevurderingvalg}
                                                fagsakId={fagsak.id}
                                            />
                                        </>
                                    )}
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
                        ) : null;
                    })}
                </>
            )}
        </DataViewer>
    );
};

const TabellData: PartialRecord<keyof Behandling | 'vedtaksdato', string> = {
    opprettet: 'Behandling opprettetdato',
    type: 'Type',
    behandlingsårsak: 'Årsak',
    status: 'Status',
    vedtaksdato: 'Vedtaksdato',
    resultat: 'Resultat',
};

interface BehandlingsoversiktTabellBehandling {
    id: string;
    type: Behandlingstype | TilbakekrevingBehandlingstype;
    årsak?: Behandlingsårsak;
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
    const generelleBehandlinger: BehandlingsoversiktTabellBehandling[] = behandlinger.map(
        (behandling) => {
            return {
                id: behandling.id,
                type: behandling.type,
                årsak: behandling.behandlingsårsak,
                status: behandling.status,
                resultat: behandling.resultat,
                opprettet: behandling.opprettet,
                applikasjon: BehandlingApplikasjon.EF_SAK,
            };
        }
    );

    const generelleTilbakekrevingBehandlinger: BehandlingsoversiktTabellBehandling[] =
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

    const { sortertListe, settSortering, sortConfig } =
        useSorteringState<BehandlingsoversiktTabellBehandling>(alleBehandlinger, {
            sorteringsfelt: 'opprettet',
            rekkefolge: 'descending',
        });

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
                            onClick={() =>
                                settSortering(felt as keyof BehandlingsoversiktTabellBehandling)
                            }
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
                            <td>
                                {behandling.årsak && behandlingsårsakTilTekst[behandling.årsak]}
                            </td>
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
                                    <a
                                        className="lenke"
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
