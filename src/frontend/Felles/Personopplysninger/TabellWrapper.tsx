import styled from 'styled-components';
import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

export const BredTd = styled.td`
    width: ${(props) => props.width ?? '25%'};
    padding-left: 0;
`;

export const Td = styled.td`
    padding-left: 0;
`;

export const TabellWrapper = styled.div<{ erDobbelTabell?: boolean }>`
    display: grid;
    padding-top: 1rem;
    grid-template-columns: 32px 40px auto 72px;
    grid-template-rows: repeat(${(props) => (props.erDobbelTabell ? 3 : 2)}, max-content);
    grid-template-areas: ${(props) =>
        props.erDobbelTabell
            ? "'. ikon tittel .' '. . første-tabell .' '. . andre-tabell .'"
            : "'. ikon tittel .' '. . innhold .'"};
    .tabell {
        .columnHeader {
            font-weight: bold;
        }
        grid-area: innhold;
        th,
        td {
            padding: 0.25rem;
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

type Kolonnetittel = string | React.ReactNode;

export const KolonneTitler: React.FC<{ titler: Kolonnetittel[] }> = ({ titler }) => {
    return (
        <thead>
            <tr>
                {titler.map((tittel, indeks) => (
                    <BredTd key={indeks} width={100 / titler.length} className={'columnHeader'}>
                        {tittel}
                    </BredTd>
                ))}
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
