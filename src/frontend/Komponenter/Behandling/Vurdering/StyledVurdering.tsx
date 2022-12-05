import styled from 'styled-components';
import { NavdsGlobalColorPurple400 } from '@navikt/ds-tokens/dist/tokens';

export const VurderingLesemodusGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-template-rows: repeat(2, max-content);
    grid-gap: 0.25rem 1rem;
`;

export const TittelOgKnappWrapper = styled.span`
    display: flex;
    justify-content: space-between;
    width: 40rem;
`;

export const SistOppdatertOgVurderingWrapper = styled.span`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 40rem;
`;

export const VertikalStrek = styled.span`
    border-left: 3px solid ${NavdsGlobalColorPurple400};
    margin-left: 0.55rem;
    grid-column: 1/2;
    min-height: 10rem;
`;
