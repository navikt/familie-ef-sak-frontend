import styled from 'styled-components';

export const StyledTabell = styled.div`
    display: grid;
    grid-template-columns: repeat(
        ${(props: { kolonner?: number }) => props.kolonner || 3},
        max-content
    );
    grid-auto-rows: min-content;
    grid-gap: 0.5rem;
    margin-bottom: 3rem;

    svg {
        max-height: 24px;
        grid-column: 1/2;
        align-self: center;
    }

    .tittel {
        grid-column: 2 / ${(props: { kolonner?: number }) => (props.kolonner || 3) + 1};
    }

    .førsteDataKolonne {
        grid-column: 2/3;
        padding-right: 3rem;
    }

    .kolonne {
        padding-right: 3rem;
    }
`;
