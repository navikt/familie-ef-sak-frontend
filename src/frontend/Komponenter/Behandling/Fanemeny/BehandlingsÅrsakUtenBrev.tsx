import React, { useEffect } from 'react';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { useHentVedtak } from '../../../App/hooks/useHentVedtak';
import { skalFerdigstilleUtenBeslutter } from '../VedtakOgBeregning/Felles/utils';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Behandlingsårsak } from '../../../App/typer/Behandlingsårsak';

interface Props {
    behandlingId: string;
}

const BehandlingsÅrsakUtenBrev: React.FC<Props> = ({ behandlingId }) => {
    const { behandling, behandlingErRedigerbar } = useBehandling();
    const { hentVedtak, vedtak } = useHentVedtak(behandlingId);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    return (
        <DataViewer response={{ behandling, vedtak }}>
            {({ behandling, vedtak }) => (
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

export default BehandlingsÅrsakUtenBrev;
