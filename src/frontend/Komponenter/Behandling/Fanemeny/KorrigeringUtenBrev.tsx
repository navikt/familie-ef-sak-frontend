import React, { useEffect } from 'react';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { useHentVedtak } from '../../../App/hooks/useHentVedtak';
import { skalFerdigstilleUtenBeslutter } from '../VedtakOgBeregning/Felles/utils';
import DataViewer from '../../../Felles/DataViewer/DataViewer';

interface Props {
    behandlingId: string;
}

const KorrigeringUtenBrev: React.FC<Props> = ({ behandlingId }) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { hentVedtak, vedtak } = useHentVedtak(behandlingId);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);
    return (
        <DataViewer response={{ vedtak }}>
            {({ vedtak }) => (
                <>
                    <AlertInfo>Korrigering av vedtak uten brevutsendelse</AlertInfo>
                    <SendTilBeslutterFooter
                        behandlingId={behandlingId}
                        kanSendesTilBeslutter={behandlingErRedigerbar}
                        behandlingErRedigerbar={behandlingErRedigerbar}
                        ferdigstillUtenBeslutter={skalFerdigstilleUtenBeslutter(vedtak)}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default KorrigeringUtenBrev;
