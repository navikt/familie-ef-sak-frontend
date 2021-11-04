import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { RessursStatus } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { EBehandlingResultat } from '../../../App/typer/vedtak';
import VedtaksresultatSwitch from './VedtaksresultatSwitch';
import SelectVedtaksresultat from './SelectVedtaksresultat';
import { Behandling } from '../../../App/typer/fagsak';
import { useHentVedtak } from '../../../App/hooks/useHentVedtak';
import { InngangsvilkårType, IVilkår, IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';

interface Props {
    behandling: Behandling;
    vilkår: IVilkår;
}

const Wrapper = styled.div`
    padding: 1rem 2rem;
`;

const erAlleVilkårOppfylt = (vilkår: IVilkår) => {
    const alleOppfyltBortsettFraAleneomsorg = vilkår.vurderinger.every((vurdering: IVurdering) => {
        if (vurdering.vilkårType !== InngangsvilkårType.ALENEOMSORG) {
            return vurdering.resultat === Vilkårsresultat.OPPFYLT;
        } else {
            return true;
        }
    });

    const aleneomsorgOppfylt = vilkår.vurderinger
        .filter((vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG)
        .some((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT);

    return alleOppfyltBortsettFraAleneomsorg && aleneomsorgOppfylt;
};

const VedtakOgBeregning: FC<Props> = ({ behandling, vilkår }) => {
    const behandlingId = behandling.id;
    const [resultatType, settResultatType] = useState<EBehandlingResultat>();
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);

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
                        />
                    </Wrapper>
                );
            }}
        </DataViewer>
    );
};

export default VedtakOgBeregning;
