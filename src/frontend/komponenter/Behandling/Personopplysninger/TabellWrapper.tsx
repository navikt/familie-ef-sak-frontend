import styled from 'styled-components';
import React from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';

export const BredTd = styled.td`
    width: 25%;
    padding-left: 0;
`;

export const TabellWrapper = styled.div<{ erDobbelTabell?: boolean }>`
    display: grid;
    padding-top: 3rem;
    grid-template-columns: 32px 40px auto 72px;
    grid-template-rows: repeat(${(props) => (props.erDobbelTabell ? 3 : 2)}, max-content);
    grid-template-areas: ${(props) =>
        props.erDobbelTabell
            ? "'. ikon tittel .' '. . første-tabell .' '. . andre-tabell .'"
            : "'. ikon tittel .' '. . innhold .'"};
    .tabell {
        grid-area: innhold;
        td {
            padding-left: 0;
        }
        table-layout: fixed;
    }
    .første-tabell {
        grid-area: første-tabell;
    }
    .andre-tabell {
        grid-area: andre-tabell;
    }
`;

export const StyledInnholdWrapper = styled.div`
    grid-area: innhold;
`;

export const KolonneTitler: React.FC<{ titler: string[] }> = ({ titler }) => {
    return (
        <thead>
            <tr>
                {titler.map((tittel, indeks) => {
                    return (
                        <BredTd key={indeks}>
                            <Element>{tittel}</Element>
                        </BredTd>
                    );
                })}
            </tr>
        </thead>
    );
};

export const IngenData: React.FC = () => {
    return (
        <StyledInnholdWrapper>
            <Normaltekst>Ingen data</Normaltekst>
        </StyledInnholdWrapper>
    );
};
