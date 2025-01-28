import styled from 'styled-components';
import React from 'react';
import { Table } from '@navikt/ds-react';
import { AFontSizeMedium } from '@navikt/ds-tokens/dist/tokens';

export const SmallTable = styled(Table).attrs({ size: 'small' })`
    max-width: max-content;
    th,
    td {
        font-size: ${AFontSizeMedium};
    }
`;

type Kolonnetittel = string | React.ReactNode;

export const KolonneTitler: React.FC<{
    titler: Kolonnetittel[];
    skalHaMinimumBreddePåKolonne?: boolean;
}> = ({ titler, skalHaMinimumBreddePåKolonne = false }) => {
    const minimumBreddePåDatoStyle = (tittel: Kolonnetittel) => {
        return tittel === 'Dato' && skalHaMinimumBreddePåKolonne ? { minWidth: '10rem' } : {};
    };

    return (
        <Table.Header>
            <Table.Row>
                {titler.map((tittel, indeks) => (
                    <Table.HeaderCell key={indeks} style={minimumBreddePåDatoStyle(tittel)}>
                        {tittel}
                    </Table.HeaderCell>
                ))}
            </Table.Row>
        </Table.Header>
    );
};
