import { Table } from '@navikt/ds-react';
import React from 'react';
import { formaterTallMedTusenSkille } from '../../../App/utils/formatter';
import { regnUtGjennomsnittÅrslønn, finnGjennomsnittligAvvik } from './utils';
import { Periode, Beregning } from './typer';

const TabellGjennomsnitt: React.FC<{ periode: Periode; beregninger: Beregning[] }> = ({
    periode,
    beregninger,
}) => {
    if (beregninger.length < 1) {
        return null;
    }

    const prefixMedNull = (verdi: string) => (parseInt(verdi) < 10 ? `0${verdi}` : verdi);

    return (
        <div>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Gjennomsnitt inntekt</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Avvik</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell>
                            {`${prefixMedNull(periode.fra.måned)}.${periode.fra.årstall} - ${prefixMedNull(periode.til.måned)}.${periode.til.årstall}`}
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterTallMedTusenSkille(regnUtGjennomsnittÅrslønn(beregninger))}
                        </Table.DataCell>
                        <Table.DataCell>{finnGjennomsnittligAvvik(beregninger)}</Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    );
};

export default TabellGjennomsnitt;
