import { FC } from 'react';
import { HStack, Heading } from '@navikt/ds-react';
import React from 'react';
import BehandlingVelger from './BehandlingVelger';
import { utledTittel } from './utils';
import { Behandling, Fagsak } from '../../../App/typer/fagsak';

const TittelOgValg: FC<{
    fagsak: Fagsak;
    valgtFagsak: Fagsak | undefined;
    behandlinger: Behandling[];
    settValgtBehandlingId: React.Dispatch<React.SetStateAction<string | undefined>>;
    visUaktuelle: boolean;
    settVisUaktuelle: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
    fagsak,
    valgtFagsak,
    behandlinger,
    settValgtBehandlingId,
    visUaktuelle,
    settVisUaktuelle,
}) => {
    return (
        <HStack gap="3" justify="space-between" align="center">
            <Heading size="medium">
                {utledTittel(fagsak).charAt(0).toUpperCase() + utledTittel(fagsak).slice(1)}
            </Heading>
            <BehandlingVelger
                valgtFagsak={valgtFagsak}
                behandlinger={behandlinger}
                settValgtBehandlingId={settValgtBehandlingId}
                visUaktuelle={visUaktuelle}
                settVisUaktuelle={settVisUaktuelle}
            />
        </HStack>
    );
};

export default TittelOgValg;
