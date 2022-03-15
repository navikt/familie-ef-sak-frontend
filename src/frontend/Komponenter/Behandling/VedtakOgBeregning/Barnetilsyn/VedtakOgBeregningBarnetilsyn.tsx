import React, { FC, useEffect, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { EBehandlingResultat } from '../../../../App/typer/vedtak';
import { useHentVedtak } from '../../../../App/hooks/useHentVedtak';
import { erAlleVilkårOppfylt } from '../Felles/utils';
import { RessursStatus } from '../../../../App/typer/ressurs';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import { Vedtaksform } from './Vedtaksform';

interface Props {
    behandling: Behandling;
    vilkår: IVilkår;
}

const Wrapper = styled.div`
    padding: 1rem 2rem;
`;

const WrapperMarginTop = styled.div`
    margin-top: 1rem;
`;

const VedtakOgBeregningBarnetilsyn: FC<Props> = ({ behandling, vilkår }) => {
    const behandlingId = behandling.id;
    const [resultatType, settResultatType] = useState<EBehandlingResultat>();
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);
    //const ikkeOppfyltVilkårEksisterer = eksistererIkkeOppfyltVilkår(vilkår);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS && vedtak.data) {
            settResultatType(vedtak.data.resultatType);
        }
    }, [vedtak]);

    return (
        <Wrapper>
            <Vedtaksform behandling={behandling} />
            <WrapperMarginTop>
                <SelectVedtaksresultat
                    behandling={behandling}
                    resultatType={resultatType}
                    settResultatType={settResultatType}
                    alleVilkårOppfylt={alleVilkårOppfylt}
                />
            </WrapperMarginTop>
        </Wrapper>
    );
};

export default VedtakOgBeregningBarnetilsyn;
