import React, { FC, useEffect } from 'react';
import {
    EBehandlingResultat,
    IVedtakForSkolepenger,
    IVedtakType,
} from '../../../../App/typer/vedtak';
import { useHentVedtak } from '../../../../App/hooks/useHentVedtak';
import { erAlleVilkårOppfylt, skalViseNullstillVedtakKnapp } from '../Felles/utils';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { AvslåVedtak } from '../Felles/AvslåVedtak/AvslåVedtak';
import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';
import { OpphøreVedtak } from './OpphøreVedtak/OpphøreVedtak';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { VedtakOgBeregningProps } from '../VedtakOgBeregningFane';

const VedtakOgBeregningSkolepenger: FC<VedtakOgBeregningProps> = ({
    behandling,
    vilkår,
    resultatType,
    settResultatType,
}) => {
    const { vedtak } = useBehandling();
    const { vedtak: forrigeVedtak, hentVedtak: hentForrigeVedtak } = useHentVedtak(
        behandling.forrigeBehandlingId
    );

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);

    useEffect(() => {
        hentForrigeVedtak();
    }, [hentForrigeVedtak]);

    return (
        <>
            <SelectVedtaksresultat
                behandling={behandling}
                resultatType={resultatType}
                settResultatType={settResultatType}
                alleVilkårOppfylt={alleVilkårOppfylt}
                skalViseNullstillVedtakKnapp={skalViseNullstillVedtakKnapp(vedtak)}
            />
            <DataViewer response={{ vedtak, forrigeVedtak }}>
                {({ vedtak, forrigeVedtak }) => {
                    const skolepengeVedtak = vedtak as unknown as IVedtakForSkolepenger;
                    switch (resultatType) {
                        case EBehandlingResultat.INNVILGE:
                            return (
                                <InnvilgeVedtak
                                    behandling={behandling}
                                    forrigeVedtak={
                                        forrigeVedtak &&
                                        (forrigeVedtak as unknown as IVedtakForSkolepenger)
                                    }
                                    key={'innvilge'}
                                    lagretVedtak={
                                        skolepengeVedtak?._type ===
                                        IVedtakType.InnvilgelseSkolepenger
                                            ? skolepengeVedtak
                                            : undefined
                                    }
                                />
                            );
                        case EBehandlingResultat.OPPHØRT:
                            return (
                                <OpphøreVedtak
                                    behandling={behandling}
                                    forrigeVedtak={
                                        forrigeVedtak &&
                                        (forrigeVedtak as unknown as IVedtakForSkolepenger)
                                    }
                                    key={'opphør'}
                                    lagretVedtak={skolepengeVedtak}
                                />
                            );

                        case EBehandlingResultat.AVSLÅ:
                            return (
                                <AvslåVedtak
                                    alleVilkårOppfylt={alleVilkårOppfylt}
                                    behandling={behandling}
                                    ikkeOppfyltVilkårEksisterer={true}
                                    key={'avslå'}
                                    lagretVedtak={
                                        vedtak?._type === IVedtakType.Avslag ? vedtak : undefined
                                    }
                                />
                            );
                        case undefined:
                        default:
                            return null;
                    }
                }}
            </DataViewer>
        </>
    );
};

export default VedtakOgBeregningSkolepenger;
