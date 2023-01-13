import React, { FC } from 'react';
import { Alert, Button } from '@navikt/ds-react';
import styled from 'styled-components';
import { Behandling } from '../../../App/typer/fagsak';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { useBehandling } from '../../../App/context/BehandlingContext';

const InformasjonVisning = styled(Alert)`
    margin: 0.5rem 0.5rem 0 0.5rem;
`;

const StyledButton = styled(Button)`
    margin-left: 1rem;
`;

export const InfostripeSattPåVent: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { settVisTaAvVentModal } = useBehandling();

    return behandling.status === BehandlingStatus.SATT_PÅ_VENT ? (
        <InformasjonVisning variant={'info'} size={'medium'}>
            Behandlingen er satt på vent
            <StyledButton size={'small'} onClick={() => settVisTaAvVentModal(true)}>
                Fortsett behandling
            </StyledButton>
        </InformasjonVisning>
    ) : null;
};
