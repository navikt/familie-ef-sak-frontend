import React from 'react';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import AlertStripeInfo from 'nav-frontend-alertstriper/lib/info-alertstripe';

interface Props {
    behandlingId: string;
}

const KorrigeringUtenBrev: React.FC<Props> = ({ behandlingId }) => {
    const { behandlingErRedigerbar } = useBehandling();

    return (
        <>
            <AlertStripeInfo>Korrigering av vedtak uten brevutsendelse</AlertStripeInfo>
            {behandlingErRedigerbar && (
                <SendTilBeslutterFooter
                    behandlingId={behandlingId}
                    kanSendesTilBeslutter={behandlingErRedigerbar}
                />
            )}
        </>
    );
};

export default KorrigeringUtenBrev;
