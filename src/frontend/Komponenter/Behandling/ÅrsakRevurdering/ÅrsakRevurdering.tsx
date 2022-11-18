import { Revurderingsinformasjon } from './typer';
import React, { useEffect, useState } from 'react';
import { Behandling } from '../../../App/typer/fagsak';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { EndreÅrsakRevurdering } from './EndreÅrsakRevurdering';
import { VisÅrsakRevurdering } from './VisÅrsakRevurdering';

interface Props {
    revurderingsinformasjon: Revurderingsinformasjon;
    behandling: Behandling;
    settVurderingUtfylt: (vurderingUtfylt: boolean) => void;
}

export const ÅrsakRevurdering: React.FC<Props> = ({
    revurderingsinformasjon: initState,
    behandling,
    settVurderingUtfylt,
}) => {
    const { behandlingErRedigerbar } = useBehandling();

    const [revurderingsinformasjon, settRevurderingsinformasjon] =
        useState<Revurderingsinformasjon>(initState);

    const [redigeringsmodus, settRedigeringsmodus] = useState<boolean>(
        behandlingErRedigerbar && !revurderingsinformasjon.årsakRevurdering
    );

    useEffect(() => {
        const årsakRevurderingUtfyltOgIkkeRedigeringsmodus =
            !redigeringsmodus && revurderingsinformasjon.årsakRevurdering !== undefined;
        settVurderingUtfylt(årsakRevurderingUtfyltOgIkkeRedigeringsmodus);
    }, [redigeringsmodus, revurderingsinformasjon.årsakRevurdering, settVurderingUtfylt]);

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
                    oppdaterRevurderingsinformasjon={(revurderingsinformasjon) => {
                        settRevurderingsinformasjon(revurderingsinformasjon);
                        settRedigeringsmodus(true);
                    }}
                    settRedigeringsmodus={settRedigeringsmodus}
                    behandling={behandling}
                />
            )}
        </>
    );
};
