import styled from 'styled-components';

export const FlexColumnContainer = styled.div<{
    gap?: number;
}>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => (props.gap ? props.gap : 1)}rem;
`;
