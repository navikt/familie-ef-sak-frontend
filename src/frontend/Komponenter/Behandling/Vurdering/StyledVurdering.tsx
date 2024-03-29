import styled from 'styled-components';
import { APurple400 } from '@navikt/ds-tokens/dist/tokens';

export const VurderingLesemodusGrid = styled.div`
    display: grid;
    grid-template-columns: max-content auto;
    grid-template-rows: max-content auto;
    grid-gap: 0.25rem 1rem;
    height: 100%;
`;

export const TittelOgKnappWrapper = styled.span`
    display: flex;
    justify-content: space-between;
    max-width: 40rem;
`;

export const SistOppdatertOgVurderingWrapper = styled.span`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 40rem;
`;

export const VertikalStrek = styled.span`
    border-left: 3px solid ${APurple400};
    margin-left: 0.55rem;
    grid-column: 1/2;
    min-height: 10rem;
`;
