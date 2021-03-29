import React from 'react';
import { StyledKnapp } from './Inngangsvilkår/Inngangsvilkår';
import { Behandling } from '../../typer/fagsak';
import { RessursStatus } from '../../typer/ressurs';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { useLocation } from 'react-router';

export const GodkjennEndringer: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { axiosRequest } = useApp();
    const { hentBehandling } = useBehandling();
    const path = useLocation().pathname.split('/').slice(-1);

    if (!['inngangsvilkar', 'aktivitet'].includes(path[0])) {
        return null;
    }

    const harEndringerIGrunnlagsdata = Object.values(
        behandling.endringerIRegistergrunnlag || {}
    ).some((endringer) => endringer.length > 0);

    const godkjennEnderinger = () => {
        axiosRequest<null, void>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/registergrunnlag/godkjenn`,
        }).then((resp) => {
            if (resp.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
            }
        });
    };

    return (
        <StyledKnapp onClick={godkjennEnderinger} hidden={!harEndringerIGrunnlagsdata}>
            Godkjenn endringer i registergrunnlag
        </StyledKnapp>
    );
};
