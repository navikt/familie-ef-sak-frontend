import React from 'react';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';

interface Props {
    behandlingId: string;
}

const KorrigeringUtenBrev: React.FC<Props> = ({ behandlingId }) => {
    const { behandlingErRedigerbar } = useBehandling();

    return (
        <>
            <AlertInfo>Korrigering av vedtak uten brevutsendelse</AlertInfo>
            <SendTilBeslutterFooter
                behandlingId={behandlingId}
                kanSendesTilBeslutter={behandlingErRedigerbar}
                behandlingErRedigerbar={behandlingErRedigerbar}
            />
        </>
    );
};

export default KorrigeringUtenBrev;
