import React from 'react';
import styled from 'styled-components';
import {
    EVilkårstyper,
    useEkspanderbareVilkårpanelContext,
} from '../../../App/context/EkspanderbareVilkårpanelContext';
import { ÅpneOgLukkePanelKnapper } from '../Inngangsvilkår/ÅpneOgLukkePanelKnapper';

const Container = styled.div`
    margin: 2rem;
    display: flex;
    align-items: flex-end;
`;

export const AktivitetsvilkårHeader: React.FC = () => {
    const { lukkAlle, åpneAlle } = useEkspanderbareVilkårpanelContext();

    return (
        <Container>
            <ÅpneOgLukkePanelKnapper
                lukkAlle={() => lukkAlle(EVilkårstyper.AKTIVITETSVILKÅR)}
                åpneAlle={() => åpneAlle(EVilkårstyper.AKTIVITETSVILKÅR)}
            />
        </Container>
    );
};
