import { OpprettBehandlingModal } from './OpprettBehandling/OpprettBehandlingModal';
import React, { Dispatch, useEffect, useState } from 'react';
import { byggTomRessurs, Ressurs } from '../../App/typer/ressurs';
import { Fagsak } from '../../App/typer/fagsak';
import { TilbakekrevingBehandling } from '../../App/typer/tilbakekreving';
import { useApp } from '../../App/context/AppContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { BehandlingsoversiktTabell } from './BehandlingsoversiktTabell';
import { FagsakTittelLinje } from './FagsakTittelLinje';
import { KlageBehandling } from '../../App/typer/klage';
import { Button, VStack } from '@navikt/ds-react';
import { harÅpenKlage } from '../../App/utils/klage';

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

    const [visLagBehandlingModal, settVisLagBehandlingModal] = useState<boolean>(false);
    const [tilbakekrevingBehandlinger, settTilbakekrevingbehandlinger] =
        useState<Ressurs<TilbakekrevingBehandling[]>>(byggTomRessurs());

    useEffect(() => {
        hentTilbakekrevingBehandlinger();
        // eslint-disable-next-line
    }, [fagsak.id]);

    return (
        <DataViewer response={{ tilbakekrevingBehandlinger }}>
            {({ tilbakekrevingBehandlinger }) => (
                <VStack gap={'space-8'}>
                    <FagsakTittelLinje fagsak={fagsak} />
                    <BehandlingsoversiktTabell
                        behandlinger={fagsak.behandlinger}
                        eksternFagsakId={fagsak.eksternId}
                        tilbakekrevingBehandlinger={tilbakekrevingBehandlinger}
                        klageBehandlinger={klageBehandlinger}
                    />
                    {erSaksbehandler && (
                        <>
                            <OpprettBehandlingModal
                                visModal={visLagBehandlingModal}
                                settVisModal={settVisLagBehandlingModal}
                                fagsak={fagsak}
                                hentTilbakekrevinger={hentTilbakekrevingBehandlinger}
                                hentKlageBehandlinger={hentKlageBehandlinger}
                                harÅpenKlage={harÅpenKlage(klageBehandlinger)}
                            />

                            <div>
                                <Button
                                    onClick={() => settVisLagBehandlingModal(true)}
                                    variant={'secondary'}
                                    type={'button'}
                                >
                                    Opprett ny behandling
                                </Button>
                            </div>
                        </>
                    )}
                </VStack>
            )}
        </DataViewer>
    );
};
