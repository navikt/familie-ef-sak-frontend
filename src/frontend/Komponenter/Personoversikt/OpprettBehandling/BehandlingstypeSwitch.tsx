import React from 'react';
import { Behandlingstype } from '../../../App/typer/behandlingstype';
import { OpprettRevurdering } from './OpprettRevurdering';
import { OpprettTilbakekreving } from './OpprettTilbakekreving';
import { OpprettKlagebehandling, OpprettKlageRequest } from './OpprettKlagebehandling';
import { Fagsak } from '../../../App/typer/fagsak';
import { RevurderingInnhold } from '../../../App/typer/revurderingstype';

interface Props {
    fagsak: Fagsak;
    valgtBehandlingstype: Behandlingstype | undefined;
    settVisModal: (bool: boolean) => void;
    opprettRevurdering: (revurderingInnhold: RevurderingInnhold) => void;
    opprettTilbakekreving: () => void;
    opprettKlagebehandling: (data: OpprettKlageRequest) => void;
}

export const BehandlingstypeSwitch: React.FC<Props> = ({
    fagsak,
    valgtBehandlingstype,
    settVisModal,
    opprettRevurdering,
    opprettTilbakekreving,
    opprettKlagebehandling,
}) => {
    if (!valgtBehandlingstype) {
        return <></>;
    }
    switch (valgtBehandlingstype) {
        case Behandlingstype.REVURDERING:
            return (
                <OpprettRevurdering
                    fagsak={fagsak}
                    opprettRevurdering={opprettRevurdering}
                    settVisModal={settVisModal}
                />
            );
        case Behandlingstype.TILBAKEKREVING:
            return (
                <OpprettTilbakekreving
                    settVisModal={settVisModal}
                    opprettTilbakekreving={opprettTilbakekreving}
                />
            );

        case Behandlingstype.KLAGE:
            return (
                <OpprettKlagebehandling
                    opprettKlagebehandling={opprettKlagebehandling}
                    settVisModal={settVisModal}
                />
            );
        default:
            return <></>;
    }
};
