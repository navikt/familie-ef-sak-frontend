import React from 'react';
import { EBehandlingResultat, IVedtak, IVedtakType } from '../../../../App/typer/vedtak';
import { Behandling } from '../../../../App/typer/fagsak';
import { InnvilgeOvergangsstønad } from './InnvilgeVedtak/InnvilgeOvergangsstønad';
import { AvslåVedtak } from './AvslåVedtak/AvslåVedtak';
import { Opphør } from './Opphør/Opphør';
import { IVilkår } from '../../Inngangsvilkår/vilkår';

interface Props {
    vedtaksresultatType?: EBehandlingResultat;
    behandling: Behandling;
    lagretVedtak?: IVedtak;
    alleVilkårOppfylt: boolean;
    ikkeOppfyltVilkårEksisterer: boolean;
    vilkår: IVilkår;
}

const VedtaksresultatSwitch: React.FC<Props> = ({
    vedtaksresultatType,
    behandling,
    lagretVedtak,
    alleVilkårOppfylt,
    ikkeOppfyltVilkårEksisterer,
    vilkår,
}) => {
    if (!vedtaksresultatType) return null;
    switch (vedtaksresultatType) {
        case EBehandlingResultat.AVSLÅ:
            return (
                <AvslåVedtak
                    behandling={behandling}
                    lagretVedtak={
                        lagretVedtak?._type === IVedtakType.Avslag ? lagretVedtak : undefined
                    }
                    alleVilkårOppfylt={alleVilkårOppfylt}
                    ikkeOppfyltVilkårEksisterer={ikkeOppfyltVilkårEksisterer}
                />
            );
        case EBehandlingResultat.INNVILGE:
            return (
                <InnvilgeOvergangsstønad
                    behandling={behandling}
                    lagretVedtak={
                        lagretVedtak?._type === IVedtakType.InnvilgelseOvergangsstønad
                            ? lagretVedtak
                            : undefined
                    }
                    vilkår={vilkår}
                />
            );
        case EBehandlingResultat.OPPHØRT:
            return (
                <Opphør
                    behandlingId={behandling.id}
                    lagretVedtak={
                        lagretVedtak?._type === IVedtakType.Opphør ? lagretVedtak : undefined
                    }
                />
            );
        default:
            return null;
    }
};

export default VedtaksresultatSwitch;
