import React, { FC } from 'react';
import { EBehandlingResultat, IVedtakType } from '../../../../App/typer/vedtak';
import { erAlleVilkårOppfylt, skalViseNullstillVedtakKnapp } from '../Felles/utils';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { AvslåVedtak } from '../Felles/AvslåVedtak/AvslåVedtak';
import { OpphøreVedtak } from '../Felles/OpphøreVedtak/OpphøreVedtak';
import { barnSomOppfyllerAlleVilkår } from './Felles/utils';
import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { VedtakOgBeregningProps } from '../VedtakOgBeregningFane';

const VedtakOgBeregningBarnetilsyn: FC<VedtakOgBeregningProps> = ({
    behandling,
    vilkår,
    resultatType,
    settResultatType,
}) => {
    const behandlingId = behandling.id;
    const { vedtak } = useBehandling();

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);

    return (
        <>
            <SelectVedtaksresultat
                behandling={behandling}
                resultatType={resultatType}
                settResultatType={settResultatType}
                alleVilkårOppfylt={alleVilkårOppfylt}
                skalViseNullstillVedtakKnapp={skalViseNullstillVedtakKnapp(vedtak)}
            />
            <DataViewer response={{ vedtak }}>
                {({ vedtak }) => {
                    switch (resultatType) {
                        case EBehandlingResultat.INNVILGE:
                        case EBehandlingResultat.INNVILGE_UTEN_UTBETALING:
                            return (
                                <InnvilgeVedtak
                                    behandling={behandling}
                                    lagretVedtak={
                                        vedtak?._type === IVedtakType.InnvilgelseBarnetilsyn ||
                                        vedtak?._type ===
                                            IVedtakType.InnvilgelseBarnetilsynUtenUtbetaling
                                            ? vedtak
                                            : undefined
                                    }
                                    barn={barnSomOppfyllerAlleVilkår(vilkår)}
                                    settResultatType={settResultatType}
                                    harKontantstøttePerioder={
                                        vilkår.grunnlag.harKontantstøttePerioder
                                    }
                                />
                            );
                        case EBehandlingResultat.AVSLÅ:
                            return (
                                <AvslåVedtak
                                    behandling={behandling}
                                    alleVilkårOppfylt={alleVilkårOppfylt}
                                    ikkeOppfyltVilkårEksisterer={true}
                                    lagretVedtak={
                                        vedtak?._type === IVedtakType.Avslag ? vedtak : undefined
                                    }
                                />
                            );
                        case EBehandlingResultat.OPPHØRT:
                            return (
                                <OpphøreVedtak
                                    behandlingId={behandlingId}
                                    lagretVedtak={
                                        vedtak?._type === IVedtakType.Opphør ? vedtak : undefined
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

export default VedtakOgBeregningBarnetilsyn;
