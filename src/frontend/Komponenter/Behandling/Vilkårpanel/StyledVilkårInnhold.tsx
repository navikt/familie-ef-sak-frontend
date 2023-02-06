import styled from 'styled-components';

export const InformasjonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const FlexColumnContainer = styled.div<{
    gap?: number;
}>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => (props.gap ? props.gap : 1)}rem;
`;
