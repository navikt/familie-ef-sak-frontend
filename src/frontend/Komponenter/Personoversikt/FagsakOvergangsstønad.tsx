import { Stønadstype } from '../../App/typer/behandlingstema';
import LagBehandlingModal from './LagBehandlingModal';
import { ToggleName } from '../../App/context/toggles';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { BehandlingResultat, Fagsak } from '../../App/typer/fagsak';
import { TilbakekrevingBehandling } from '../../App/typer/tilbakekreving';
import { BehandlingsoversiktTabell, FagsakTittelLinje } from './Behandlingsoversikt';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';
import { useApp } from '../../App/context/AppContext';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';
import { useToggles } from '../../App/context/TogglesContext';

const KnappMedMargin = styled(Knapp)`
    margin-top: 1rem;
    margin-right: 1rem;
`;

interface Props {
    fagsakId: string;
    fagsakOvergangsstønad: Ressurs<Fagsak>;
    settFagsakOvergangsstønad: Dispatch<SetStateAction<Ressurs<Fagsak>>>;
    hentFagsak: (id: string, settFagsak: Dispatch<SetStateAction<Ressurs<Fagsak>>>) => void;
}

export const FagsakOvergangsstønad: React.FC<Props> = ({
    fagsakId,
    fagsakOvergangsstønad,
    settFagsakOvergangsstønad,
    hentFagsak,
}) => {
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();

    const gjørTekniskOpphør = () => {
        axiosRequest<void, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/tekniskopphor/${fagsakId}`,
        }).then((response: RessursSuksess<void> | RessursFeilet) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentFagsak(fagsakId, settFagsakOvergangsstønad);
            } else {
                settTekniskOpphørFeilet(true);
            }
        });
    };

    const hentTilbakekrevingBehandlinger = () =>
        axiosRequest<TilbakekrevingBehandling[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/tilbakekreving/behandlinger/${fagsakId}`,
        }).then((response) => settTilbakekrevingbehandlinger(response));

    const [kanStarteRevurdering, settKanStarteRevurdering] = useState<boolean>(false);
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
        if (fagsakOvergangsstønad.status === RessursStatus.SUKSESS) {
            settKanStarteRevurdering(erAlleBehandlingerErFerdigstilt(fagsakOvergangsstønad.data));
        }
        // eslint-disable-next-line
    }, [fagsakOvergangsstønad]);

    useEffect(() => {
        hentTilbakekrevingBehandlinger();
        // eslint-disable-next-line
    }, [fagsakId]);

    return (
        <DataViewer
            response={{
                fagsakOvergangsstønad,
                tilbakekrevingBehandlinger,
            }}
        >
            {({ fagsakOvergangsstønad, tilbakekrevingBehandlinger }) => (
                <>
                    <FagsakTittelLinje fagsak={fagsakOvergangsstønad} />
                    <BehandlingsoversiktTabell
                        behandlinger={fagsakOvergangsstønad.behandlinger}
                        eksternFagsakId={fagsakOvergangsstønad.eksternId}
                        tilbakekrevingBehandlinger={tilbakekrevingBehandlinger}
                    />
                    {fagsakOvergangsstønad.stønadstype === Stønadstype.OVERGANGSSTØNAD &&
                        kanStarteRevurdering && (
                            <>
                                <LagBehandlingModal
                                    visModal={visLagBehandlingModal}
                                    settVisModal={settVisLagBehandlingModal}
                                    fagsakId={fagsakOvergangsstønad.id}
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
