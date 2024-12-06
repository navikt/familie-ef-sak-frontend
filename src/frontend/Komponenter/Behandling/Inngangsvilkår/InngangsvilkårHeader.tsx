import React from 'react';
import styled from 'styled-components';
import { OppdaterOpplysninger } from './OppdaterOpplysninger';
import { ÅpneOgLukkePanelKnapper } from './ÅpneOgLukkePanelKnapper';
import {
    EVilkårstyper,
    useEkspanderbareVilkårpanelContext,
} from '../../../App/context/EkspanderbareVilkårpanelContext';

const FlexRow = styled.div`
    margin: 2rem;
    display: flex;
    justify-content: space-between;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const AlignBottom = styled.div`
    align-self: end;
`;

interface Props {
    oppdatertDato: string;
    behandlingErRedigerbar: boolean;
    oppdaterGrunnlagsdata: (behandlingId: string) => Promise<void>;
    behandlingId: string;
}

export const InngangsvilkårHeader: React.FC<Props> = ({
    oppdatertDato,
    behandlingErRedigerbar,
    oppdaterGrunnlagsdata,
    behandlingId,
}) => {
    const { lukkAlle, åpneAlle } = useEkspanderbareVilkårpanelContext();

    return (
        <FlexRow>
            <FlexColumn>
                <OppdaterOpplysninger
                    oppdatertDato={oppdatertDato}
                    behandlingErRedigerbar={behandlingErRedigerbar}
                    oppdaterGrunnlagsdata={oppdaterGrunnlagsdata}
                    behandlingId={behandlingId}
                />
            </FlexColumn>
            <AlignBottom>
                <ÅpneOgLukkePanelKnapper
                    lukkAlle={() => lukkAlle(EVilkårstyper.INNGANGSVILKÅR)}
                    åpneAlle={() => åpneAlle(EVilkårstyper.INNGANGSVILKÅR)}
                />
            </AlignBottom>
        </FlexRow>
    );
};
