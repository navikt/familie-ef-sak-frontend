import React, { useState } from 'react';
import { Behandling } from '../../../App/typer/fagsak';
import { RessursStatus } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import { Knapp } from 'nav-frontend-knapper';

const StyledKnapp = styled(hiddenIf(Knapp))`
    display: block;
    margin: 2rem auto 0;
`;

export const GodkjennEndringer: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { axiosRequest } = useApp();
    const { hentBehandling } = useBehandling();
    const path = useLocation().pathname.split('/').slice(-1);
    const [laster, settLaster] = useState<boolean>(false);

    if (!['inngangsvilkar', 'aktivitet'].includes(path[0])) {
        return null;
    }

    const harEndringerIGrunnlagsdata = Object.values(
        behandling.endringerIRegistergrunnlag || {}
    ).some((endringer) => endringer.length > 0);

    const godkjennEnderinger = () => {
        settLaster(true);
        axiosRequest<null, void>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/registergrunnlag/godkjenn`,
        })
            .then((resp) => {
                if (resp.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <StyledKnapp
            onClick={godkjennEnderinger}
            hidden={!harEndringerIGrunnlagsdata}
            disabled={laster}
        >
            Godkjenn endringer i registergrunnlag
        </StyledKnapp>
    );
};
