import { Revurderingsinformasjon } from './typer';
import React, { useState } from 'react';
import { Behandling } from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { EndreÅrsakRevurdering } from './EndreÅrsakRevurdering';
import { VisÅrsakRevurdering } from './VisÅrsakRevurdering';

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    behandling: Behandling;
}

export const ÅrsakRevurdering: React.FC<Props> = ({ revurderingsinformasjon, behandling }) => {
    const { behandlingErRedigerbar } = useBehandling();

    const [redigeringsmodus, settRedigeringsmodus] = useState<boolean>(
        behandlingErRedigerbar && revurderingsinformasjon.årsakRevurdering !== undefined
    );
    return (
        <>
            {redigeringsmodus ? (
                <EndreÅrsakRevurdering
                    revurderingsinformasjon={revurderingsinformasjon}
                    behandling={behandling}
                    settRedigeringsmodus={settRedigeringsmodus}
                />
            ) : (
                <VisÅrsakRevurdering
                    revurderingsinformasjon={revurderingsinformasjon}
                    settRedigeringsmodus={settRedigeringsmodus}
                />
            )}
        </>
    );
};
