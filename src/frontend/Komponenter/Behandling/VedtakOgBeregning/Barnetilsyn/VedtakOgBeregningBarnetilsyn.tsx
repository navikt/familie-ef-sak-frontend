import React, { FC, useEffect, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { EBehandlingResultat, IInnvilgeVedtakForBarnetilsyn } from '../../../../App/typer/vedtak';
import { useHentVedtak } from '../../../../App/hooks/useHentVedtak';
import { erAlleVilkårOppfylt } from '../Felles/utils';
import { RessursStatus } from '../../../../App/typer/ressurs';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Vedtaksform } from './Vedtaksform';
import { AvslåVedtak } from '../Overgangsstønad/AvslåVedtak/AvslåVedtak';
import { Opphør } from '../Overgangsstønad/Opphør/Opphør';

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
    const [resultatType, settResultatType] = useState<EBehandlingResultat | undefined>();
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
        <Wrapper>
            <SelectVedtaksresultat
                behandling={behandling}
                resultatType={resultatType}
                settResultatType={settResultatType}
                alleVilkårOppfylt={alleVilkårOppfylt}
            />
            <WrapperMarginTop>
                <DataViewer response={{ vedtak }}>
                    {({ vedtak }) => {
                        switch (resultatType) {
                            case EBehandlingResultat.INNVILGE:
                            case EBehandlingResultat.INNVILGE_UTEN_UTBETALING:
                                return (
                                    <Vedtaksform
                                        behandling={behandling}
                                        lagretVedtak={
                                            vedtak as unknown as IInnvilgeVedtakForBarnetilsyn // TODO: Fjern "as" når vi får på plass vedtakDto-håndtering(egen oppgave)
                                        }
                                        barn={vilkår.grunnlag.barnMedSamvær}
                                        settResultatType={settResultatType}
                                    />
                                );
                            case EBehandlingResultat.AVSLÅ:
                                return (
                                    <AvslåVedtak
                                        behandling={behandling}
                                        alleVilkårOppfylt={alleVilkårOppfylt}
                                        ikkeOppfyltVilkårEksisterer={true}
                                        lagretVedtak={vedtak}
                                    />
                                );
                            case EBehandlingResultat.OPPHØRT:
                                return <Opphør behandlingId={behandlingId} />;
                            case undefined:
                                return null;
                        }
                    }}
                </DataViewer>
            </WrapperMarginTop>
        </Wrapper>
    );
};

export default VedtakOgBeregningBarnetilsyn;
