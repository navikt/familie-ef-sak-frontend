import React from 'react';
import styled from 'styled-components';
import { OppdaterOpplysninger } from './OppdaterOpplysninger';
import { KopierInngangsvilkår } from './KopierInngangsvilkår';
import { ToggleName } from '../../../../App/context/toggles';
import { useToggles } from '../../../../App/context/TogglesContext';

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
    const { toggles } = useToggles();
    return (
        <Container>
            <OppdaterOpplysninger
                oppdatertDato={oppdatertDato}
                behandlingErRedigerbar={behandlingErRedigerbar}
                oppdaterGrunnlagsdata={oppdaterGrunnlagsdata}
                behandlingId={behandlingId}
            />
            {/*// TODO: Sjekke på forrige behandling for å avgjøre om man skal vise infoboks eller ikke*/}
            {toggles[ToggleName.visGjenbrukAvVilkår] && <KopierInngangsvilkår />}
        </Container>
    );
};
