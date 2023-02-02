import { Tag } from '@navikt/ds-react';
import styled from 'styled-components';

export const InformasjonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

export const FlexColumnContainer = styled.div<{
    gap?: number;
}>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => (props.gap ? props.gap : 1)}rem;
`;

export const TagMedTilpassetBredde = styled(Tag)`
    width: fit-content;
`;
