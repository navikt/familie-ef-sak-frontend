import { VilkårsresultatIkon } from '../../Felleskomponenter/Visning/VilkårsresultatIkon';
import { EtikettLiten, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { Vilkårsresultat } from './vilkår';

type VilkårtittelProps = {
    tittel: string;
    paragrafTittel?: string;
    vilkårsresultat: Vilkårsresultat;
};

const Container = styled.div`
    padding-bottom: 1rem;
    display: flex;
    align-items: center;

    .typo-undertittel {
        margin: 0 1rem 0 0.5rem;
    }
    .typo-etikett-liten {
        color: ${navFarger.navGra60};
    }
`;

export const Vilkårstittel: React.FC<VilkårtittelProps> = ({
    vilkårsresultat,
    tittel,
    paragrafTittel,
}) => {
    return (
        <Container>
            <VilkårsresultatIkon vilkårsresultat={vilkårsresultat} />
            <Undertittel>{tittel}</Undertittel>
            {paragrafTittel && <EtikettLiten>{paragrafTittel}</EtikettLiten>}
        </Container>
    );
};
