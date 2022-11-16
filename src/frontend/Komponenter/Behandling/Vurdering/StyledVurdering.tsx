import styled from 'styled-components';
import navFarger from 'nav-frontend-core';

export const StyledVurderingLesemodus = styled.div`
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
`;

export const StyledStrek = styled.span`
    border-left: 3px solid ${navFarger.navLillaLighten20};
    margin-left: 0.55rem;
    grid-column: 1/2;
    min-height: 10rem;
`;
