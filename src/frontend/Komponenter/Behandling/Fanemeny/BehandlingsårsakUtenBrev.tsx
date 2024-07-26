import React from 'react';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { skalFerdigstilleUtenBeslutter } from '../VedtakOgBeregning/Felles/utils';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';
import { Behandling } from '../../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
}

const BehandlingsårsakUtenBrev: React.FC<Props> = ({ behandling }) => {
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
                    <SendTilBeslutterFooter
                        behandling={behandling}
                        kanSendesTilBeslutter={behandlingErRedigerbar}
                        behandlingErRedigerbar={behandlingErRedigerbar}
                        ferdigstillUtenBeslutter={skalFerdigstilleUtenBeslutter(vedtak)}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default BehandlingsårsakUtenBrev;
