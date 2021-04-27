import React from 'react';
import { EBehandlingResultat, IVedtak } from '../../../typer/vedtak';
import { Behandling } from '../../../typer/fagsak';
import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';
import { BehandleIGosys } from './BehandleIGosys/BehandleIGosys';
import { AvslåVedtak } from './AvslåVedtak/AvslåVedtak';

interface Props {
    vedtaksresultatType?: EBehandlingResultat;
    behandling: Behandling;
    lagretVedtak?: IVedtak;
}

const VedtaksresultatSwitch: React.FC<Props> = ({
    vedtaksresultatType,
    behandling,
    lagretVedtak,
}) => {
    if (!vedtaksresultatType) return null;
    switch (vedtaksresultatType) {
        case EBehandlingResultat.AVSLÅ:
            return <AvslåVedtak />;
        case EBehandlingResultat.INNVILGE:
            return (
                <InnvilgeVedtak
                    vedtaksresultatType={vedtaksresultatType}
                    behandling={behandling}
                    lagretVedtak={lagretVedtak}
                />
            );
        case EBehandlingResultat.BEHANDLE_I_GOSYS:
            return <BehandleIGosys behandlingId={behandling.id} />;
        default:
            return null;
    }
};

export default VedtaksresultatSwitch;
