import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RessursStatus } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { EBehandlingResultat } from '../../../App/typer/vedtak';
import VedtaksresultatSwitch from './VedtaksresultatSwitch';
import SelectVedtaksresultat from './SelectVedtaksresultat';
import { Behandling } from '../../../App/typer/fagsak';
import { useHentVedtak } from '../../../App/hooks/useHentVedtak';
import { IVilkår } from '../Inngangsvilkår/vilkår';
import { erAlleVilkårOppfylt, eksistererIkkeOppfyltVilkår } from '../Vilkårresultat/utils';

interface Props {
    behandling: Behandling;
    vilkår: IVilkår;
}

const Wrapper = styled.div`
    padding: 1rem 2rem;
`;

const VedtakOgBeregningOvergangsstønad: FC<Props> = ({ behandling, vilkår }) => {
    const behandlingId = behandling.id;
    const [resultatType, settResultatType] = useState<EBehandlingResultat>();
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);
    const ikkeOppfyltVilkårEksisterer = eksistererIkkeOppfyltVilkår(vilkår);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS && vedtak.data) {
            settResultatType(vedtak.data.resultatType);
        }
    }, [vedtak]);

    return (
        <DataViewer response={{ vedtak }}>
            {({ vedtak }) => {
                return (
                    <Wrapper>
                        <SelectVedtaksresultat
                            behandling={behandling}
                            resultatType={resultatType}
                            settResultatType={settResultatType}
                            alleVilkårOppfylt={alleVilkårOppfylt}
                        />
                        <VedtaksresultatSwitch
                            vedtaksresultatType={resultatType}
                            behandling={behandling}
                            lagretVedtak={vedtak}
                            alleVilkårOppfylt={alleVilkårOppfylt}
                            ikkeOppfyltVilkårEksisterer={ikkeOppfyltVilkårEksisterer}
                        />
                    </Wrapper>
                );
            }}
        </DataViewer>
    );
};

export default VedtakOgBeregningOvergangsstønad;
