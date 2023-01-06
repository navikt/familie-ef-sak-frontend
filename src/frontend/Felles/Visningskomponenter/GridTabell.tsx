import styled from 'styled-components';
import { AGray800 } from '@navikt/ds-tokens/dist/tokens';

export const GridTabell = styled.div<{
    kolonner?: number;
    underTabellMargin?: number;
    gridGap?: number;
    utenIkon?: boolean;
}>`
    display: grid;
    grid-template-columns: ${(props) => (props.utenIkon ? 0 : 21)}px 250px repeat(
            ${(props) => (props.kolonner ? props.kolonner - 2 : 2)},
            ${(props) => (props.kolonner && props.kolonner > 3 ? '150px' : '325px')}
        );
    grid-auto-rows: min-content;
    grid-gap: ${(props) => props.gridGap || 0.5}rem;
    margin-bottom: ${(props) =>
        props.underTabellMargin === 0 ? 0 : props.underTabellMargin || 3}rem;

    > .navds-body-short {
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
        grid-column: 2 / ${(props) => (props.kolonner || 3) + 1};
    }

    .tittel {
        padding-bottom: 0.25rem;
        grid-column: 2 / ${(props) => (props.kolonner || 3) + 1};

        display: flex;
        align-items: center;
        .navds-heading {
            margin-right: 1rem;
        }
        .navds-tag {
            color: ${AGray800};
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

    .tekstUtenIkon {
        grid-column: 2 / 4;
    }
`;

export const GridTabellRad = styled.div<{ kolonner?: number; overTabellRadPadding?: number }>`
    padding-top: ${(props) => props.overTabellRadPadding || 2}rem;
    grid-column: 1 / ${(props) => (props.kolonner ? props.kolonner + 1 : 4)};
`;

export const GridTabellWrapper = styled.div`
    display: contents;
`;
