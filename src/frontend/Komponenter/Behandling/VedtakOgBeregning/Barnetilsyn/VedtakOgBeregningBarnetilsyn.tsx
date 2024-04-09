import React, { FC, useEffect, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import { EBehandlingResultat, IVedtakType } from '../../../../App/typer/vedtak';
import { useHentVedtak } from '../../../../App/hooks/useHentVedtak';
import { erAlleVilkårOppfylt, skalViseNullstillVedtakKnapp } from '../Felles/utils';
import { RessursStatus } from '../../../../App/typer/ressurs';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { AvslåVedtak } from '../Felles/AvslåVedtak/AvslåVedtak';
import { OpphøreVedtak } from '../Felles/OpphøreVedtak/OpphøreVedtak';
import { barnSomOppfyllerAlleVilkår } from './Felles/utils';
import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';

interface Props {
    behandling: Behandling;
    vilkår: IVilkår;
}

const VedtakOgBeregningBarnetilsyn: FC<Props> = ({ behandling, vilkår }) => {
    const behandlingId = behandling.id;
    const [resultatType, settResultatType] = useState<EBehandlingResultat | undefined>();
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak, behandling]);

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settResultatType(vedtak.data?.resultatType);
        }
    }, [vedtak]);

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
