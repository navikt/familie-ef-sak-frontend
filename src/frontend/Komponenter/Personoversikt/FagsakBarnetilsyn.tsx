import DataViewer from '../../Felles/DataViewer/DataViewer';
import React from 'react';
import { Ressurs } from '../../App/typer/ressurs';
import { Fagsak } from '../../App/typer/fagsak';
import { BehandlingsoversiktTabell, FagsakTittelLinje } from './Behandlingsoversikt';

interface Props {
    fagsakBarnetilsyn: Ressurs<Fagsak>;
}

export const FagsakBarnetilsyn: React.FC<Props> = ({ fagsakBarnetilsyn }) => {
    return (
        <DataViewer
            response={{
                fagsakBarnetilsyn,
            }}
        >
            {({ fagsakBarnetilsyn }) => (
                <>
                    <FagsakTittelLinje fagsak={fagsakBarnetilsyn} />
                    <BehandlingsoversiktTabell
                        behandlinger={fagsakBarnetilsyn.behandlinger}
                        eksternFagsakId={fagsakBarnetilsyn.eksternId}
                        tilbakekrevingBehandlinger={[]}
                    />
                </>
            )}
        </DataViewer>
    );
};
