import React from 'react';
import { Fagsak } from '../../App/typer/fagsak';
import { BehandlingsoversiktTabell } from './BehandlingsoversiktTabell';
import { FagsakTittelLinje } from './FagsakTittelLinje';

interface Props {
    fagsak: Fagsak;
}

export const FagsakBarnetilsyn: React.FC<Props> = ({ fagsak }) => {
    return (
        <>
            <FagsakTittelLinje fagsak={fagsak} />
            <BehandlingsoversiktTabell
                behandlinger={fagsak.behandlinger}
                eksternFagsakId={fagsak.eksternId}
                tilbakekrevingBehandlinger={[]}
            />
        </>
    );
};
