import React, { FC, useState } from 'react';
import { Alert, Button } from '@navikt/ds-react';
import styled from 'styled-components';
import { Behandling } from '../../../App/typer/fagsak';
import {
    BehandlingStatus,
    ETaAvVentStatus,
    TaAvVentStatus,
} from '../../../App/typer/behandlingstatus';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useApp } from '../../../App/context/AppContext';
import { RessursStatus } from '@navikt/familie-typer';
import { RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';
import { TaAvVentModal } from './TaAvVentModal';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

const InformasjonVisning = styled(Alert)`
    margin: 0.5rem 0.5rem 0 0.5rem;
`;

const StyledButton = styled(Button)`
    margin-left: 1rem;
`;

/**
 * Kan slettes når ToggleName.settPåVentMedOppgavestyring er skrudd på
 */
export const InfostripeSattPåVent: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { hentBehandling } = useBehandling();
    const { axiosRequest } = useApp();
    const [taAvVentStatus, settTaAvVentStatus] = useState<ETaAvVentStatus>();
    const { toggles } = useToggles();

    const [feilmelding, settFeilmelding] = useState('');

    const taAvVent = () => {
        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/aktiver`,
        }).then((respons: RessursFeilet | RessursSuksess<string>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
    };

    const håndterFortsettBehandling = () => {
        axiosRequest<TaAvVentStatus, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/kan-ta-av-vent`,
        }).then((respons: RessursFeilet | RessursSuksess<TaAvVentStatus>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                respons.data.status === ETaAvVentStatus.OK
                    ? taAvVent()
                    : settTaAvVentStatus(respons.data.status);
            } else {
                settFeilmelding(respons.frontendFeilmelding);
            }
        });
    };

    return (
        <>
            {!toggles[ToggleName.settPåVentMedOppgavestyring] &&
                behandling.status === BehandlingStatus.SATT_PÅ_VENT && (
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
            <TaAvVentModal
                behandlingId={behandling.id}
                taAvVentStatus={taAvVentStatus}
                nullstillTaAvVentStatus={() => settTaAvVentStatus(undefined)}
            />
        </>
    );
};
