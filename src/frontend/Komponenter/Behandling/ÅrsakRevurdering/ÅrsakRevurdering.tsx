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

    const [erRedigeringsmodus, settErRedigeringsmodus] = useState<boolean>(
        behandlingErRedigerbar && !revurderingsinformasjon.årsakRevurdering
    );

    useEffect(() => {
        return () => {
            settErRedigeringsmodus(
                behandlingErRedigerbar && !revurderingsinformasjon.årsakRevurdering
            );
        };
        // eslint-disable-next-line
    }, [behandlingErRedigerbar]);

    useEffect(() => {
        const årsakRevurderingUtfyltOgIkkeRedigeringsmodus =
            !erRedigeringsmodus && revurderingsinformasjon.årsakRevurdering !== undefined;
        settVurderingUtfylt(årsakRevurderingUtfyltOgIkkeRedigeringsmodus);
    }, [erRedigeringsmodus, revurderingsinformasjon.årsakRevurdering, settVurderingUtfylt]);

    return (
        <>
            {erRedigeringsmodus ? (
                <EndreÅrsakRevurdering
                    revurderingsinformasjon={revurderingsinformasjon}
                    behandling={behandling}
                    oppdaterRevurderingsinformasjon={(revurderingsinformasjon) => {
                        settRevurderingsinformasjon(revurderingsinformasjon);
                        settErRedigeringsmodus(false);
                    }}
                />
            ) : (
                <VisÅrsakRevurdering
                    revurderingsinformasjon={revurderingsinformasjon}
                    oppdaterRevurderingsinformasjon={(revurderingsinformasjon) => {
                        settRevurderingsinformasjon(revurderingsinformasjon);
                        settErRedigeringsmodus(true);
                    }}
                    settRedigeringsmodus={settErRedigeringsmodus}
                    behandling={behandling}
                />
            )}
        </>
    );
};
