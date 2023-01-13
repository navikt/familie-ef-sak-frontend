import React, { FC } from 'react';
import { Alert } from '@navikt/ds-react';
import styled from 'styled-components';
import { Behandling } from '../../../App/typer/fagsak';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';

const InformasjonVisning = styled(Alert)`
    margin: 0.5rem 0.5rem 0 0.5rem;
`;

export const InfostripeSattPåVent: FC<{ behandling: Behandling }> = ({ behandling }) => {
    return behandling.status === BehandlingStatus.SATT_PÅ_VENT ? (
        <InformasjonVisning variant={'info'} size={'small'}>
            Behandlingen er satt på vent
        </InformasjonVisning>
    ) : null;
};
