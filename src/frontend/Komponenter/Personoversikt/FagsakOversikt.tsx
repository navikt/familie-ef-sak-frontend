import LagBehandlingModal from './LagBehandlingModal';
import React, { useEffect, useState } from 'react';
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
import { ToggleName } from '../../App/context/toggles';
import { useToggles } from '../../App/context/TogglesContext';
import { Stønadstype } from '../../App/typer/behandlingstema';

const KnappMedMargin = styled(Knapp)`
    margin-top: 1rem;
    margin-right: 1rem;
`;

interface Props {
    fagsak: Fagsak;
}

export const FagsakOversikt: React.FC<Props> = ({ fagsak }) => {
    const { axiosRequest, erSaksbehandler } = useApp();
    const { toggles } = useToggles();

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

    const skalViseOpprettNyBehandlingKnapp =
        fagsak.stønadstype === Stønadstype.OVERGANGSSTØNAD ||
        fagsak.stønadstype === Stønadstype.BARNETILSYN ||
        toggles[ToggleName.skalViseOpprettNyBehandlingSkolepenger];

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
                    />
                    {erSaksbehandler && skalViseOpprettNyBehandlingKnapp && (
                        <>
                            <LagBehandlingModal
                                visModal={visLagBehandlingModal}
                                settVisModal={settVisLagBehandlingModal}
                                fagsak={fagsak}
                                hentTilbakekrevinger={hentTilbakekrevingBehandlinger}
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
