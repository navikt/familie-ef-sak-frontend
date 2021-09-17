import React from 'react';
import { EBehandlingResultat, IVedtak } from '../../../App/typer/vedtak';
import { Behandling } from '../../../App/typer/fagsak';
import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';
import { BehandleIGosys } from './BehandleIGosys/BehandleIGosys';
import { AvslåVedtak } from './AvslåVedtak/AvslåVedtak';
import { Opphør } from './Opphør/Opphør';

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
            return <AvslåVedtak behandling={behandling} lagretVedtak={lagretVedtak} />;
        case EBehandlingResultat.INNVILGE:
            return <InnvilgeVedtak behandling={behandling} lagretVedtak={lagretVedtak} />;
        case EBehandlingResultat.BEHANDLE_I_GOSYS:
            return <BehandleIGosys behandlingId={behandling.id} />;
        case EBehandlingResultat.OPPHØRT:
            return <Opphør behandlingId={behandling.id} lagretVedtak={lagretVedtak} />;
        default:
            return null;
    }
};

export default VedtaksresultatSwitch;
