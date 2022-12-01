import { VilkårsresultatIkon } from '../../../Felles/Ikoner/VilkårsresultatIkon';
import React from 'react';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { Vilkårsresultat } from './vilkår';
import { Heading } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';

type VilkårtittelProps = {
    tittel: string;
    paragrafTittel?: string;
    vilkårsresultat: Vilkårsresultat;
};

const Container = styled.div`
    padding-bottom: 1rem;
    display: flex;
    align-items: center;

    .tittel {
        margin: 0 1rem 0 0.5rem;
    }
    .paragrafTittel {
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
            <Heading className={'tittel'} size="small" level="5">
                {tittel}
            </Heading>
            {paragrafTittel && (
                <BodyShortSmall className={'paragrafTittel'}>{paragrafTittel}</BodyShortSmall>
            )}
        </Container>
    );
};
