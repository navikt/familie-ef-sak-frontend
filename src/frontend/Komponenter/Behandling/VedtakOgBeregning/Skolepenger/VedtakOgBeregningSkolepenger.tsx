import React, { FC, useEffect, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
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
import { AvslåVedtak } from '../Felles/AvslåVedtak/AvslåVedtak';
import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';
import { OpphøreVedtak } from './OpphøreVedtak/OpphøreVedtak';

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
        <>
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
                                <InnvilgeVedtak
                                    behandling={behandling}
                                    forrigeVedtak={
                                        vedtakForrigeBehandling &&
                                        (vedtakForrigeBehandling as unknown as IVedtakForSkolepenger)
                                    }
                                    key={'innvilge'}
                                    lagretInnvilgetVedtak={
                                        vedtakForSkolepenger?._type ===
                                        IVedtakType.InnvilgelseSkolepenger
                                            ? vedtakForSkolepenger
                                            : undefined
                                    }
                                />
                            );
                        case EBehandlingResultat.OPPHØRT:
                            return (
                                <OpphøreVedtak
                                    behandling={behandling}
                                    forrigeVedtak={
                                        vedtakForrigeBehandling &&
                                        (vedtakForrigeBehandling as unknown as IVedtakForSkolepenger)
                                    }
                                    key={'opphør'}
                                    lagretInnvilgetVedtak={vedtakForSkolepenger}
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
