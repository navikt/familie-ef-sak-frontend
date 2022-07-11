import React from 'react';
import styled from 'styled-components';
import { OppdaterOpplysninger } from './OppdaterOpplysninger';
import { ForrigeBehandlingBoks } from './ForrigeBehandlingBoks';
import { useBehandling } from '../../../../App/context/BehandlingContext';

const Container = styled.div<{ åpenHøyremeny: boolean }>`
    display: flex;
    justify-content: space-between;
    @media only screen and (max-width: ${(p) => (p.åpenHøyremeny ? '1600px' : '1300px')}) {
        flex-direction: column;
    }
`;

interface Props {
    oppdatertDato: string;
    behandlingErRedigerbar: boolean;
    oppdaterGrunnlagsdata: (behandlingId: string) => void;
    behandlingId: string;
}

export const InngangsvilkårHeader: React.FC<Props> = ({
    oppdatertDato,
    behandlingErRedigerbar,
    oppdaterGrunnlagsdata,
    behandlingId,
}) => {
    const { åpenHøyremeny } = useBehandling();
    return (
        <Container åpenHøyremeny={åpenHøyremeny}>
            <OppdaterOpplysninger
                oppdatertDato={oppdatertDato}
                behandlingErRedigerbar={behandlingErRedigerbar}
                oppdaterGrunnlagsdata={oppdaterGrunnlagsdata}
                behandlingId={behandlingId}
            />
            <ForrigeBehandlingBoks />
        </Container>
    );
};
