import React, { FC } from 'react';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import VedtaksresultatSwitch from './VedtaksresultatSwitch';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import {
    eksistererIkkeOppfyltVilkårForOvergangsstønad,
    erAlleVilkårOppfylt,
} from '../Felles/utils';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { VedtakOgBeregningProps } from '../VedtakOgBeregningFane';

const VedtakOgBeregningOvergangsstønad: FC<VedtakOgBeregningProps> = ({
    behandling,
    vilkår,
    resultatType,
    settResultatType,
}) => {
    const { vedtak } = useBehandling();

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);
    const ikkeOppfyltVilkårEksisterer = eksistererIkkeOppfyltVilkårForOvergangsstønad(vilkår);

    return (
        <DataViewer response={{ vedtak }}>
            {({ vedtak }) => (
                <>
                    <SelectVedtaksresultat
                        behandling={behandling}
                        resultatType={resultatType}
                        settResultatType={settResultatType}
                        alleVilkårOppfylt={alleVilkårOppfylt}
                        skalViseNullstillVedtakKnapp={!!vedtak}
                    />
                    <VedtaksresultatSwitch
                        vedtaksresultatType={resultatType}
                        behandling={behandling}
                        lagretVedtak={vedtak}
                        alleVilkårOppfylt={alleVilkårOppfylt}
                        ikkeOppfyltVilkårEksisterer={ikkeOppfyltVilkårEksisterer}
                        vilkår={vilkår}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default VedtakOgBeregningOvergangsstønad;
