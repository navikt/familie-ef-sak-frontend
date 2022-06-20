import React, { FC, useEffect, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { EBehandlingResultat, IVedtakForSkolepenger } from '../../../../App/typer/vedtak';
import { useHentVedtak } from '../../../../App/hooks/useHentVedtak';
import { erAlleVilkårOppfylt } from '../Felles/utils';
import { RessursStatus } from '../../../../App/typer/ressurs';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { VedtaksformSkolepenger } from './InnvilgetSkolepenger/VedtaksformSkolepenger';
import { AvslåVedtak } from '../Overgangsstønad/AvslåVedtak/AvslåVedtak';

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

const VedtakOgBeregningSkolepenger: FC<Props> = ({ behandling, vilkår }) => {
    const { id: behandlingId, forrigeBehandlingId } = behandling;
    const [resultatType, settResultatType] = useState<EBehandlingResultat | undefined>();
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);
    const { vedtak: vedtakForrigeBehandling, hentVedtak: hentVedtakForrigeBehandling } =
        useHentVedtak(forrigeBehandlingId);

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    useEffect(() => {
        hentVedtakForrigeBehandling();
    }, [hentVedtakForrigeBehandling]);

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
                <DataViewer response={{ vedtak, vedtakForrigeBehandling }}>
                    {({ vedtak, vedtakForrigeBehandling }) => {
                        switch (resultatType) {
                            case EBehandlingResultat.INNVILGE:
                            case EBehandlingResultat.OPPHØRT:
                                return (
                                    <VedtaksformSkolepenger
                                        behandling={behandling}
                                        erOpphør={resultatType === EBehandlingResultat.OPPHØRT}
                                        lagretInnvilgetVedtak={
                                            vedtak as unknown as IVedtakForSkolepenger
                                        }
                                        forrigeVedtak={
                                            vedtakForrigeBehandling &&
                                            (vedtakForrigeBehandling as unknown as IVedtakForSkolepenger)
                                        }
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
                            case undefined:
                                return null;
                        }
                    }}
                </DataViewer>
            </WrapperMarginTop>
        </Wrapper>
    );
};

export default VedtakOgBeregningSkolepenger;
