import styled from 'styled-components';

export const GridTabell = styled.div<{
    kolonner?: number;
    ikonVisning: boolean;
}>`
    display: grid;
    grid-template-columns: ${(props) => props.ikonVisning && '21px'} min(200px, 250px) repeat(
            ${(props) => (props.kolonner ? props.kolonner - 2 : 2)},
            ${(props) => (props.kolonner && props.kolonner > 3 ? '150px' : '325px')}
        );
    grid-gap: 0.5rem;

    .tittel {
        padding-bottom: 0.25rem;
        grid-column: ${(props) => (props.ikonVisning ? 2 : 1)} /
            ${(props) => (props.kolonner || 3) + 1};

        display: flex;
        align-items: center;
    }

    .førsteDataKolonne {
        grid-column: ${(props) => (props.ikonVisning ? '2/3' : '1/2')};
    }
`;
