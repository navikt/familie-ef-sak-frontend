import React, { FC, useEffect, useState } from 'react';
import { RessursStatus } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { EBehandlingResultat } from '../../../../App/typer/vedtak';
import VedtaksresultatSwitch from './VedtaksresultatSwitch';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import { Behandling } from '../../../../App/typer/fagsak';
import { useHentVedtak } from '../../../../App/hooks/useHentVedtak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import {
    eksistererIkkeOppfyltVilkårForOvergangsstønad,
    erAlleVilkårOppfylt,
} from '../Felles/utils';

interface Props {
    behandling: Behandling;
    vilkår: IVilkår;
}

const VedtakOgBeregningOvergangsstønad: FC<Props> = ({ behandling, vilkår }) => {
    const [resultatType, settResultatType] = useState<EBehandlingResultat>();
    const { vedtak, hentVedtak } = useHentVedtak(behandling.id);

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);
    const ikkeOppfyltVilkårEksisterer = eksistererIkkeOppfyltVilkårForOvergangsstønad(vilkår);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak, behandling]);

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settResultatType(vedtak.data?.resultatType);
        }
    }, [vedtak]);

    return (
        <DataViewer response={{ vedtak }}>
            {({ vedtak }) => {
                return (
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
                );
            }}
        </DataViewer>
    );
};

export default VedtakOgBeregningOvergangsstønad;
