import React, { FC, useEffect, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import { EBehandlingResultat, IInnvilgeVedtakForBarnetilsyn } from '../../../../App/typer/vedtak';
import { useHentVedtak } from '../../../../App/hooks/useHentVedtak';
import { erAlleVilkårOppfylt, skalViseNullstillVedtakKnapp } from '../Felles/utils';
import { RessursStatus } from '../../../../App/typer/ressurs';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { AvslåVedtak } from '../Overgangsstønad/AvslåVedtak/AvslåVedtak';
import { Opphør } from '../Overgangsstønad/Opphør/Opphør';
import { barnSomOppfyllerAlleVilkår } from './utils';
import { InnvilgeBarnetilsyn } from './InnvilgeBarnetilsyn';

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
                                <InnvilgeBarnetilsyn
                                    behandling={behandling}
                                    lagretVedtak={
                                        vedtak as IInnvilgeVedtakForBarnetilsyn | undefined
                                    }
                                    barn={barnSomOppfyllerAlleVilkår(vilkår)}
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
                            return <Opphør behandlingId={behandlingId} lagretVedtak={vedtak} />;
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
