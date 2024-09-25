import React, { FC, useEffect, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import { EBehandlingResultat, IVedtakType } from '../../../../App/typer/vedtak';
import { erAlleVilkårOppfylt, skalViseNullstillVedtakKnapp } from '../Felles/utils';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { AvslåVedtak } from '../Felles/AvslåVedtak/AvslåVedtak';
import { OpphøreVedtak } from '../Felles/OpphøreVedtak/OpphøreVedtak';
import { barnSomOppfyllerAlleVilkår } from './Felles/utils';
import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';
import { useBehandling } from '../../../../App/context/BehandlingContext';

interface Props {
    behandling: Behandling;
    vilkår: IVilkår;
}

const VedtakOgBeregningBarnetilsyn: FC<Props> = ({ behandling, vilkår }) => {
    const behandlingId = behandling.id;
    const { vedtak, vedtaksresultat } = useBehandling();

    const [resultatType, settResultatType] = useState<EBehandlingResultat | undefined>(
        vedtaksresultat
    );

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);

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
