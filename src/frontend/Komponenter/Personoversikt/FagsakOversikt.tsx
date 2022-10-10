import LagBehandlingModal from './LagBehandlingModal';
import React, { Dispatch, useEffect, useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../App/typer/ressurs';
import { Fagsak } from '../../App/typer/fagsak';
import { TilbakekrevingBehandling } from '../../App/typer/tilbakekreving';
import { useApp } from '../../App/context/AppContext';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { BehandlingsoversiktTabell } from './BehandlingsoversiktTabell';
import { FagsakTittelLinje } from './FagsakTittelLinje';
import { erAlleBehandlingerErFerdigstilt } from './utils';
import { KlageBehandling } from '../../App/typer/klage';

const KnappMedMargin = styled(Knapp)`
    margin-top: 1rem;
    margin-right: 1rem;
`;

interface Props {
    fagsak: Fagsak;
    klageBehandlinger: KlageBehandling[];
    hentKlageBehandlinger: Dispatch<void>;
}

export const FagsakOversikt: React.FC<Props> = ({
    fagsak,
    klageBehandlinger,
    hentKlageBehandlinger,
}) => {
    const { axiosRequest, erSaksbehandler } = useApp();

    const hentTilbakekrevingBehandlinger = () =>
        axiosRequest<TilbakekrevingBehandling[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/tilbakekreving/behandlinger/${fagsak.id}`,
        }).then((response) => settTilbakekrevingbehandlinger(response));

    const kanStarteRevurdering = erAlleBehandlingerErFerdigstilt(fagsak);
    const [visLagBehandlingModal, settVisLagBehandlingModal] = useState<boolean>(false);
    const [tilbakekrevingBehandlinger, settTilbakekrevingbehandlinger] = useState<
        Ressurs<TilbakekrevingBehandling[]>
    >(byggTomRessurs());

    useEffect(() => {
        hentTilbakekrevingBehandlinger();
        // eslint-disable-next-line
    }, [fagsak.id]);

    return (
        <DataViewer response={{ tilbakekrevingBehandlinger }}>
            {({ tilbakekrevingBehandlinger }) => (
                <>
                    <FagsakTittelLinje fagsak={fagsak} />
                    <BehandlingsoversiktTabell
                        behandlinger={fagsak.behandlinger}
                        eksternFagsakId={fagsak.eksternId}
                        tilbakekrevingBehandlinger={tilbakekrevingBehandlinger}
                        klageBehandlinger={klageBehandlinger}
                    />
                    {erSaksbehandler && (
                        <>
                            <LagBehandlingModal
                                visModal={visLagBehandlingModal}
                                settVisModal={settVisLagBehandlingModal}
                                fagsak={fagsak}
                                hentTilbakekrevinger={hentTilbakekrevingBehandlinger}
                                hentKlageBehandlinger={hentKlageBehandlinger}
                                kanStarteRevurdering={kanStarteRevurdering}
                            />

                            <KnappMedMargin onClick={() => settVisLagBehandlingModal(true)}>
                                Opprett ny behandling
                            </KnappMedMargin>
                        </>
                    )}
                </>
            )}
        </DataViewer>
    );
};
