import styled from 'styled-components';
import navFarger from 'nav-frontend-core';

export const StyledTabell = styled.div`
    display: grid;
    grid-template-columns: max-content minmax(100px, 250px) repeat(
            ${(props: { kolonner?: number }) => (props.kolonner ? props.kolonner - 2 : 2)},
            minmax(100px, 300px)
        );
    grid-auto-rows: min-content;
    grid-gap: 0.5rem;
    margin-bottom: 3rem;

    > .typo-normal {
        padding-right: 2.5rem;
    }

    .vilkårStatusIkon {
        align-self: auto;
    }

    svg {
        max-height: 24px;
        grid-column: 1/2;
        align-self: start;
    }

    .undertittel {
        grid-column: 2 / ${(props: { kolonner?: number }) => (props.kolonner || 3) + 1};
    }

    .tittel {
        padding-bottom: 1rem;
        grid-column: 2 / ${(props: { kolonner?: number }) => (props.kolonner || 3) + 1};

        display: flex;
        align-items: center;
        .typo-undertittel {
            margin-right: 1rem;
        }
        .typo-etikett-liten {
            color: ${navFarger.navGra60};
        }
    }

    .fjernSpacing {
        padding-bottom: 0;
    }
    .leggTilSpacing {
        padding-bottom: 1rem;
    }

    .førsteDataKolonne {
        grid-column: 2/3;
        padding-right: 3rem;
    }

    .kolonne {
        padding-right: 3rem;
    }

    .tomTabell {
        color: ${navFarger.navGra60};
    }
`;

// export const TittelIkonWrapper = styled.

export const StyledTabellWrapper = styled.div`
    display: contents;
`;
