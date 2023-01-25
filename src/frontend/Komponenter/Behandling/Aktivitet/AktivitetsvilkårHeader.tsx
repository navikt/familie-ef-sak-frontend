import React from 'react';
import styled from 'styled-components';
import { ÅpneOgLukkePanelKnapper } from '../Inngangsvilkår/InngangsvilkårHeader/ÅpneOgLukkePanelKnapper';

const Container = styled.div`
    margin: 2rem;
    display: flex;
    align-items: flex-end;
`;

export const AktivitetsvilkårHeader: React.FC = () => {
    return (
        <Container>
            <ÅpneOgLukkePanelKnapper />
        </Container>
    );
};
