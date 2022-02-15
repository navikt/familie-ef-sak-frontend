import LagBehandlingModal from './LagBehandlingModal';
import { ToggleName } from '../../App/context/toggles';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import React, { useEffect, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { BehandlingResultat, Fagsak } from '../../App/typer/fagsak';
import { TilbakekrevingBehandling } from '../../App/typer/tilbakekreving';
import { FagsakTittelLinje } from './Behandlingsoversikt';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { useApp } from '../../App/context/AppContext';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';
import { useToggles } from '../../App/context/TogglesContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { BehandlingsoversiktTabell } from './BehandlingsoversiktTabell';

const KnappMedMargin = styled(Knapp)`
    margin-top: 1rem;
    margin-right: 1rem;
`;

interface Props {
    fagsak: Fagsak;
    rehentFagsak: () => void;
}

export const FagsakOvergangsstønad: React.FC<Props> = ({ fagsak, rehentFagsak }) => {
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();

    const gjørTekniskOpphør = () => {
        axiosRequest<void, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/tekniskopphor/${fagsak.id}`,
        }).then((response: RessursSuksess<void> | RessursFeilet) => {
            if (response.status === RessursStatus.SUKSESS) {
                rehentFagsak();
            } else {
                settTekniskOpphørFeilet(true);
            }
        });
    };

    const hentTilbakekrevingBehandlinger = () =>
        axiosRequest<TilbakekrevingBehandling[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/tilbakekreving/behandlinger/${fagsak.id}`,
        }).then((response) => settTilbakekrevingbehandlinger(response));

    const kanStarteRevurdering = erAlleBehandlingerErFerdigstilt(fagsak);
    const [visLagBehandlingModal, settVisLagBehandlingModal] = useState<boolean>(false);
    const [tekniskOpphørFeilet, settTekniskOpphørFeilet] = useState<boolean>(false);
    const [tilbakekrevingBehandlinger, settTilbakekrevingbehandlinger] = useState<
        Ressurs<TilbakekrevingBehandling[]>
    >(byggTomRessurs());

    function erAlleBehandlingerErFerdigstilt(fagsak: Fagsak) {
        return (
            fagsak.behandlinger.some(
                (behandling) => behandling.resultat !== BehandlingResultat.HENLAGT
            ) &&
            fagsak.behandlinger.find(
                (behandling) => behandling.status !== BehandlingStatus.FERDIGSTILT
            ) === undefined
        );
    }

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
                    {kanStarteRevurdering && (
                        <>
                            <LagBehandlingModal
                                visModal={visLagBehandlingModal}
                                settVisModal={settVisLagBehandlingModal}
                                fagsakId={fagsak.id}
                                hentTilbakekrevinger={hentTilbakekrevingBehandlinger}
                            />

                            <KnappMedMargin onClick={() => settVisLagBehandlingModal(true)}>
                                Opprett ny behandling
                            </KnappMedMargin>
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
            )}
        </DataViewer>
    );
};
