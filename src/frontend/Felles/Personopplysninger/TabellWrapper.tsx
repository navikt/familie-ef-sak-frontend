import React from 'react';
import { Table } from '@navikt/ds-react';
import styles from './TableWrapper.module.css';

export const SmallTable: React.FC<React.ComponentProps<typeof Table>> = (props) => (
    <Table size={'small'} className={styles.stable}>
        {props.children}
    </Table>
);

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
