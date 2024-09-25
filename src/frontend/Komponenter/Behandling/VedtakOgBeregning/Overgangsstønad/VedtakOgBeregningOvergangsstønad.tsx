import React, { FC, useEffect, useState } from 'react';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { EBehandlingResultat } from '../../../../App/typer/vedtak';
import VedtaksresultatSwitch from './VedtaksresultatSwitch';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import {
    eksistererIkkeOppfyltVilkårForOvergangsstønad,
    erAlleVilkårOppfylt,
} from '../Felles/utils';
import { useBehandling } from '../../../../App/context/BehandlingContext';

interface Props {
    behandling: Behandling;
    vilkår: IVilkår;
}

const VedtakOgBeregningOvergangsstønad: FC<Props> = ({ behandling, vilkår }) => {
    const { vedtak, vedtaksresultat } = useBehandling();

    const [resultatType, settResultatType] = useState<EBehandlingResultat | undefined>(
        vedtaksresultat
    );

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);
    const ikkeOppfyltVilkårEksisterer = eksistererIkkeOppfyltVilkårForOvergangsstønad(vilkår);

    /**
     * Når vedtaket nullstilles av saksbehandler må resultattypen
     * også nullstilles for at saksbehandler skal se endring på vedtakssiden
     */
    useEffect(() => {
        if (resultatType !== undefined && vedtaksresultat === undefined) {
            settResultatType(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vedtaksresultat]);

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
