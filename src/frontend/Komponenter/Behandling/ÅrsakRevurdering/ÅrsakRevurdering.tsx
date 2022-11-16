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

export const ÅrsakRevurdering: React.FC<Props> = ({
    revurderingsinformasjon: initState,
    behandling,
}) => {
    const { behandlingErRedigerbar } = useBehandling();

    const [revurderingsinformasjon, settRevurderingsinformasjon] =
        useState<Revurderingsinformasjon>(initState);

    const [redigeringsmodus, settRedigeringsmodus] = useState<boolean>(
        behandlingErRedigerbar && !revurderingsinformasjon.årsakRevurdering
    );
    return (
        <>
            {redigeringsmodus ? (
                <EndreÅrsakRevurdering
                    revurderingsinformasjon={revurderingsinformasjon}
                    behandling={behandling}
                    oppdaterRevurderingsinformasjon={(revurderingsinformasjon) => {
                        settRevurderingsinformasjon(revurderingsinformasjon);
                        settRedigeringsmodus(false);
                    }}
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
