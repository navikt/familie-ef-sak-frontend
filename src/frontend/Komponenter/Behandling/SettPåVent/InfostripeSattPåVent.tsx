import React, { FC, useState } from 'react';
import { Alert, Button } from '@navikt/ds-react';
import styled from 'styled-components';
import { Behandling } from '../../../App/typer/fagsak';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';
import { RessursStatus } from '@navikt/familie-typer';
import { RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';

const InformasjonVisning = styled(Alert)`
    margin: 0.5rem 0.5rem 0 0.5rem;
`;

const StyledButton = styled(Button)`
    margin-left: 1rem;
`;

export const InfostripeSattPåVent: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { settVisTaAvVentModal, hentBehandling } = useBehandling();
    const { axiosRequest } = useApp();

    const [feilmelding, settFeilmelding] = useState('');

    const taAvVent = () => {
        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/aktiver`,
        }).then((respons: RessursFeilet | RessursSuksess<string>) => {
            if (respons.status == RessursStatus.SUKSESS) {
                hentBehandling.rerun();
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
    };

    const håndterFortsettBehandling = () => {
        axiosRequest<boolean, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/har-nyere-vedtak`,
        }).then((respons: RessursFeilet | RessursSuksess<boolean>) => {
            if (respons.status == RessursStatus.SUKSESS) {
                respons.data ? settVisTaAvVentModal(true) : taAvVent();
            } else {
                return 'Feilet';
            }
        });
    };

    return (
        <>
            {behandling.status === BehandlingStatus.SATT_PÅ_VENT && (
                <InformasjonVisning variant={'info'} size={'medium'}>
                    Behandlingen er satt på vent
                    <StyledButton size={'small'} onClick={håndterFortsettBehandling}>
                        Fortsett behandling
                    </StyledButton>
                </InformasjonVisning>
            )}
            {feilmelding && (
                <Alert variant="error">Kunne ikke ta behandling av vent: {feilmelding} </Alert>
            )}
        </>
    );
};
