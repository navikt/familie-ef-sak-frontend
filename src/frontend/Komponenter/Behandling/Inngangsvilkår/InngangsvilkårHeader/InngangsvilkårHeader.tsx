import React from 'react';
import styled from 'styled-components';
import { OppdaterOpplysninger } from './OppdaterOpplysninger';
import { ForrigeBehandlingBoks } from './ForrigeBehandlingBoks';

const Container = styled.div`
    display: flex;
    justify-content: space-between;
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
    return (
        <Container>
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
