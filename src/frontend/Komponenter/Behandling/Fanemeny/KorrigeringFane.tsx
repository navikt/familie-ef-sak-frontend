import React from 'react';
import SendTilBeslutter from '../Totrinnskontroll/SendTilBeslutter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { utledAvslagValg } from '../VedtakOgBeregning/Felles/utils';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Behandlingsårsak } from '../../../App/typer/behandlingsårsak';
import { Behandling } from '../../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
}

export const KorrigeringFane: React.FC<Props> = ({ behandling }) => {
    const { behandlingErRedigerbar, vedtak } = useBehandling();

    return (
        <DataViewer response={{ vedtak }}>
            {({ vedtak }) => (
                <>
                    <AlertInfo>
                        {behandling.behandlingsårsak === Behandlingsårsak.IVERKSETTE_KA_VEDTAK
                            ? 'Iverksette KA-vedtak (uten brev)'
                            : 'Korrigering av vedtak uten brevutsendelse'}
                    </AlertInfo>
                    <SendTilBeslutter
                        behandling={behandling}
                        kanSendesTilBeslutter={behandlingErRedigerbar}
                        behandlingErRedigerbar={behandlingErRedigerbar}
                        avslagValg={utledAvslagValg(vedtak)}
                    />
                </>
            )}
        </DataViewer>
    );
};
