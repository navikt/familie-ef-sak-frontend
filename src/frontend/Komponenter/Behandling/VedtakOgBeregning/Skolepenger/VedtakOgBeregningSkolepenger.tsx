import React, { FC, useEffect, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import {
    EBehandlingResultat,
    IVedtakForSkolepenger,
    IVedtakType,
} from '../../../../App/typer/vedtak';
import { useHentVedtak } from '../../../../App/hooks/useHentVedtak';
import { erAlleVilkårOppfylt, skalViseNullstillVedtakKnapp } from '../Felles/utils';
import { RessursStatus } from '../../../../App/typer/ressurs';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { VedtaksformSkolepenger } from './InnvilgetSkolepenger/VedtaksformSkolepenger';
import { AvslåVedtak } from '../Overgangsstønad/AvslåVedtak/AvslåVedtak';

const Container = styled.div`
    padding: 0 2rem 1rem 2rem;
`;

interface Props {
    behandling: Behandling;
    vilkår: IVilkår;
}

const VedtakOgBeregningSkolepenger: FC<Props> = ({ behandling, vilkår }) => {
    const { id: behandlingId, forrigeBehandlingId } = behandling;
    const [resultatType, settResultatType] = useState<EBehandlingResultat | undefined>();
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);
    const { vedtak: vedtakForrigeBehandling, hentVedtak: hentVedtakForrigeBehandling } =
        useHentVedtak(forrigeBehandlingId);

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak, behandling]);

    useEffect(() => {
        hentVedtakForrigeBehandling();
    }, [hentVedtakForrigeBehandling]);

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settResultatType(vedtak.data?.resultatType);
        }
    }, [vedtak]);

    return (
        <Container>
            <SelectVedtaksresultat
                behandling={behandling}
                resultatType={resultatType}
                settResultatType={settResultatType}
                alleVilkårOppfylt={alleVilkårOppfylt}
                skalViseNullstillVedtakKnapp={skalViseNullstillVedtakKnapp(vedtak)}
            />
            <DataViewer response={{ vedtak, vedtakForrigeBehandling }}>
                {({ vedtak, vedtakForrigeBehandling }) => {
                    const vedtakForSkolepenger = vedtak as unknown as IVedtakForSkolepenger;
                    switch (resultatType) {
                        case EBehandlingResultat.INNVILGE:
                            return (
                                <VedtaksformSkolepenger
                                    key={'innvilgelse'}
                                    behandling={behandling}
                                    erOpphør={false}
                                    lagretInnvilgetVedtak={
                                        vedtakForSkolepenger?._type ===
                                        IVedtakType.InnvilgelseSkolepenger
                                            ? vedtakForSkolepenger
                                            : undefined
                                    }
                                    forrigeVedtak={
                                        vedtakForrigeBehandling &&
                                        (vedtakForrigeBehandling as unknown as IVedtakForSkolepenger)
                                    }
                                />
                            );
                        case EBehandlingResultat.OPPHØRT:
                            return (
                                <VedtaksformSkolepenger
                                    key={'opphør'}
                                    behandling={behandling}
                                    erOpphør={true}
                                    lagretInnvilgetVedtak={
                                        vedtakForSkolepenger?._type ===
                                        IVedtakType.OpphørSkolepenger
                                            ? vedtakForSkolepenger
                                            : undefined
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
                        default:
                            return null;
                    }
                }}
            </DataViewer>
        </Container>
    );
};

export default VedtakOgBeregningSkolepenger;
