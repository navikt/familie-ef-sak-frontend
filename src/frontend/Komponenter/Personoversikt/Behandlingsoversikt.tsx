import React, { useEffect, useState } from 'react';
import { Behandling, Fagsak } from '../../App/typer/fagsak';
import styled from 'styled-components';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
import { formatterEnumVerdi } from '../../App/utils/utils';
import { Link, useHistory } from 'react-router-dom';
import { useSorteringState } from '../../App/hooks/felles/useSorteringState';
import SorteringsHeader from '../Oppgavebenk/OppgaveSorteringHeader';
import { Behandlingstype } from '../../App/typer/behandlingstype';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { PartialRecord } from '../../App/typer/common';
import { ToggleName } from '../../App/context/toggles';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useToggles } from '../../App/context/TogglesContext';
import { Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { compareDesc } from 'date-fns';
import RevurderingModal from './RevurderingModal';

const StyledTable = styled.table`
    width: 40%;
    padding: 2rem;
    margin-left: 1rem;
`;

const KnappMedMargin = styled(Knapp)`
    margin-top: 1rem;
    margin-right: 1rem;
`;

const StyledSystemtittel = styled(Systemtittel)`
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
`;

const Behandlingsoversikt: React.FC<{ fagsakId: string }> = ({ fagsakId }) => {
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());
    const [tekniskOpphørFeilet, settTekniskOpphørFeilet] = useState<boolean>(false);
    const [kanStarteRevurdering, settKanStarteRevurdering] = useState<boolean>(false);
    const [visRevurderingvalg, settVisRevurderingvalg] = useState<boolean>(false);
    const [skalNavigereTilBehandlingen, settSkalNavigereTilBehandlingen] = useState<boolean>(false);
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const history = useHistory();

    const hentFagsak = () =>
        axiosRequest<Fagsak, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
        }).then((response) => settFagsak(response));

    const gjørTekniskOpphør = () => {
        axiosRequest<Ressurs<void>, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/tekniskopphor/${fagsakId}`,
        }).then((response) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentFagsak();
            } else if (
                response.status === RessursStatus.FEILET ||
                response.status === RessursStatus.FUNKSJONELL_FEIL
            ) {
                settTekniskOpphørFeilet(true);
            }
        });
    };

    const sorterBehandlingerNyesteFørst = (behandlinger: Behandling[]) => {
        const listeKopi = [...behandlinger];
        listeKopi.sort((a, b) => {
            return compareDesc(new Date(a.opprettet), new Date(b.opprettet));
        });
        return listeKopi;
    };

    const hentBehandlingsIdTilRevurdering = (behandlinger: Behandling[]) => {
        const sorterteBehandlinger = sorterBehandlingerNyesteFørst(behandlinger);
        const nyesteBehandling = sorterteBehandlinger[0];
        const behandlingsId = nyesteBehandling.id;
        return behandlingsId;
    };

    useEffect(() => {
        if (fagsakId) {
            hentFagsak();
        }
        // eslint-disable-next-line
    }, [fagsakId]);

    useEffect(() => {
        if (fagsak.status === RessursStatus.SUKSESS) {
            if (skalNavigereTilBehandlingen) {
                settSkalNavigereTilBehandlingen(false);
                const behandlingsId = hentBehandlingsIdTilRevurdering(fagsak.data.behandlinger);
                history.push(`/behandling/${behandlingsId}`);
            }
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
        <DataViewer response={{ fagsak }}>
            {({ fagsak }) => (
                <>
                    <StyledSystemtittel tag="h3">
                        Fagsak: {formatterEnumVerdi(fagsak.stønadstype)}
                    </StyledSystemtittel>
                    <BehandlingsoversiktTabell behandlinger={fagsak.behandlinger} />

                    {kanStarteRevurdering && (
                        <KnappMedMargin onClick={() => settVisRevurderingvalg(true)}>
                            Opprett ny behandling
                        </KnappMedMargin>
                    )}
                    <RevurderingModal
                        visModal={visRevurderingvalg}
                        settVisModal={settVisRevurderingvalg}
                        fagsakId={fagsakId}
                        hentFagsak={hentFagsak}
                        settSkalNavigereTilBehandlingen={settSkalNavigereTilBehandlingen}
                        settKanStarteRevurdering={settKanStarteRevurdering}
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

const TabellData: PartialRecord<keyof Behandling, string> = {
    opprettet: 'Behandling opprettetdato',
    type: 'Type',
    status: 'Status',
    resultat: 'Resultat',
};

const BehandlingsoversiktTabell: React.FC<Pick<Fagsak, 'behandlinger'>> = ({ behandlinger }) => {
    const { sortertListe, settSortering, sortConfig } = useSorteringState<Behandling>(
        behandlinger,
        {
            sorteringsfelt: 'opprettet',
            rekkefolge: 'ascending',
        }
    );

    return (
        <StyledTable className="tabell">
            <thead>
                <tr>
                    {Object.entries(TabellData).map(([felt, tekst]) => (
                        <SorteringsHeader
                            rekkefolge={
                                sortConfig?.sorteringsfelt === felt
                                    ? sortConfig?.rekkefolge
                                    : undefined
                            }
                            tekst={tekst}
                            onClick={() => settSortering(felt as keyof Behandling)}
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
                                {behandling.type === Behandlingstype.TEKNISK_OPPHØR ? (
                                    <span>{formatterEnumVerdi(behandling.resultat)}</span>
                                ) : (
                                    <Link
                                        className="lenke"
                                        to={{ pathname: `/behandling/${behandling.id}` }}
                                    >
                                        {formatterEnumVerdi(behandling.resultat)}
                                    </Link>
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
