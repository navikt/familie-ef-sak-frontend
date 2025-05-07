import React from 'react';
import SendTilBeslutter from '../Totrinnskontroll/SendTilBeslutter';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';
import { Behandlingsårsak } from '../../../App/typer/behandlingsårsak';
import { Behandling } from '../../../App/typer/fagsak';

interface Props {
    behandling: Behandling;
}

export const KorrigeringFane: React.FC<Props> = ({ behandling }) => {
    const { behandlingErRedigerbar } = useBehandling();

    return (
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
            />
        </>
    );
};
