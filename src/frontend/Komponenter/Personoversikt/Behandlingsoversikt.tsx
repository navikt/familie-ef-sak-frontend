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
import { PartialRecord } from '../../App/typer/common';
import Alertstripe from 'nav-frontend-alertstriper';
import { Systemtittel } from 'nav-frontend-typografi';
import { EtikettInfo } from 'nav-frontend-etiketter';
import {
    TilbakekrevingBehandling,
    TilbakekrevingBehandlingsresultatstype,
    TilbakekrevingBehandlingstype,
} from '../../App/typer/tilbakekreving';
import { tilbakekrevingBaseUrl } from '../../App/utils/miljø';
import { Behandlingsårsak, behandlingsårsakTilTekst } from '../../App/typer/Behandlingsårsak';
import { FagsakOvergangsstønad } from './FagsakOvergangsstønad';
import { FagsakBarnetilsyn } from './FagsakBarnetilsyn';

const StyledTable = styled.table`
    width: 50%;
    padding: 2rem;
    margin-left: 1rem;
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

    const [feilFagsakHenting, settFeilFagsakHenting] = useState<string>();

    const { axiosRequest } = useApp();
    const { overgangsstønad: fagsakIdOvergangsstønad, barnetilsyn: fagsakIdBarnetilsyn } =
        fagsakPerson;

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

    useEffect(() => {
        if (fagsakIdOvergangsstønad) {
            hentFagsak(fagsakIdOvergangsstønad, settFagsakOvergangsstønad);
        }
        if (fagsakIdBarnetilsyn) {
            hentFagsak(fagsakIdBarnetilsyn, settFagsakBarnetilsyn);
        }
        // eslint-disable-next-line
    }, [fagsakIdOvergangsstønad, fagsakIdBarnetilsyn]);

    return (
        <>
            {fagsakIdOvergangsstønad && (
                <FagsakOvergangsstønad
                    fagsakId={fagsakIdOvergangsstønad}
                    fagsakOvergangsstønad={fagsakOvergangsstønad}
                    settFagsakOvergangsstønad={settFagsakOvergangsstønad}
                    hentFagsak={hentFagsak}
                />
            )}
            {fagsakIdBarnetilsyn && <FagsakBarnetilsyn fagsakBarnetilsyn={fagsakBarnetilsyn} />}
            {feilFagsakHenting && <Alertstripe type="feil">Kunne ikke hente fagsak</Alertstripe>}
        </>
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

export const BehandlingsoversiktTabell: React.FC<{
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

export const FagsakTittelLinje: React.FC<{
    fagsak: Fagsak;
}> = ({ fagsak }) => (
    <TittelLinje>
        <Systemtittel tag="h3">Fagsak: {formatterEnumVerdi(fagsak.stønadstype)}</Systemtittel>
        {fagsak.erLøpende && <StyledEtikettInfo mini>Løpende</StyledEtikettInfo>}
    </TittelLinje>
);

export default Behandlingsoversikt;
