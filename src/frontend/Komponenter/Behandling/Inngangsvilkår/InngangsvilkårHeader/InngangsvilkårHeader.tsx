import React from 'react';
import styled from 'styled-components';
import { OppdaterOpplysninger } from './OppdaterOpplysninger';
import { ForrigeBehandlingBoks } from './ForrigeBehandlingBoks';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { ToggleName } from '../../../../App/context/toggles';
import { useToggles } from '../../../../App/context/TogglesContext';

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
    const { toggles } = useToggles();
    return (
        <Container åpenHøyremeny={åpenHøyremeny}>
            <OppdaterOpplysninger
                oppdatertDato={oppdatertDato}
                behandlingErRedigerbar={behandlingErRedigerbar}
                oppdaterGrunnlagsdata={oppdaterGrunnlagsdata}
                behandlingId={behandlingId}
            />
            {/*// TODO: Sjekke på forrige behandling for å avgjøre om man skal vise infoboks eller ikke*/}
            {toggles[ToggleName.visGjenbrukAvVilkår] && <ForrigeBehandlingBoks />}
        </Container>
    );
};
