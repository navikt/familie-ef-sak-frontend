import { VilkårsresultatIkon } from '../../../Felles/Ikoner/VilkårsresultatIkon';
import React from 'react';
import styled from 'styled-components';
import { Vilkårsresultat } from './vilkår';
import { Heading } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

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
        color: ${ATextSubtle};
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
