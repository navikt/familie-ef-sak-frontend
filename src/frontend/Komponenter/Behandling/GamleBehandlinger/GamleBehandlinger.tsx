import React, { useEffect, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';
import { GamleBehandlingerTabell } from './GamleBehandlingerTabell';

const StyledGamleBehandlinger = styled.div`
    width: inherit;
`;

const StyledHeading = styled(Heading)`
    padding: 1rem;
`;

const GamleBehandlinger = () => {
    const { axiosRequest } = useApp();
    const [gamleBehandlinger, settGamleBehandlinger] = useState<Ressurs<Behandling[]>>(
        byggTomRessurs()
    );

    useEffect(() => {
        axiosRequest<Behandling[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/gamle-behandlinger`,
        }).then((res: Ressurs<Behandling[]>) => settGamleBehandlinger(res));
    }, [axiosRequest]);

    return (
        <StyledGamleBehandlinger>
            <>
                <StyledHeading spacing size="large" level="3">
                    Gamle behandlinger
                </StyledHeading>
                <DataViewer response={{ gamleBehandlinger }}>
                    {({ gamleBehandlinger }) => (
                        <GamleBehandlingerTabell gamleBehandlinger={gamleBehandlinger} />
                    )}
                </DataViewer>
            </>
        </StyledGamleBehandlinger>
    );
};

export default GamleBehandlinger;
