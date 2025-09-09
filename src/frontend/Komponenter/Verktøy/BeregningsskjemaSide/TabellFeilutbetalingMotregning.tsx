import { Table } from '@navikt/ds-react';
import React from 'react';
import { Beregning } from './typer';
import {
    lagBeregningFraOgMedBeregnetFra,
    regnUtMotregning,
    regnUtSumFeilutbetaling,
} from './utils';
import { utledFeilutbetalingTag } from './BeregningsskjemaSide';

export const TabellFeilutbetalingMotregning: React.FC<{
    beregninger: Beregning[];
}> = ({ beregninger }) => {
    const beregningerFraOgMedBeregnetFra = lagBeregningFraOgMedBeregnetFra(beregninger);

    const sumFeilutbetaling = regnUtSumFeilutbetaling(beregningerFraOgMedBeregnetFra);
    const sumMotregning = regnUtMotregning(beregningerFraOgMedBeregnetFra);
    const sumFeilutbetalingEllerMotregning = sumFeilutbetaling + sumMotregning;

    if (beregninger.length === 0) {
        return;
    }

    return (
        <div>
            <Table size="small">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell scope="col">Feilutbetaling</Table.HeaderCell>
                        <Table.HeaderCell scope="col">Motregning</Table.HeaderCell>
                        <Table.HeaderCell scope="col">
                            Feilutbetaling etter motregning
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.DataCell>{utledFeilutbetalingTag(sumFeilutbetaling)}</Table.DataCell>
                        <Table.DataCell>{utledFeilutbetalingTag(sumMotregning)}</Table.DataCell>
                        <Table.DataCell>
                            {utledFeilutbetalingTag(sumFeilutbetalingEllerMotregning)}
                        </Table.DataCell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    );
};

export default TabellFeilutbetalingMotregning;
