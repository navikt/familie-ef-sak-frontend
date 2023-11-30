import React from 'react';
import styled from 'styled-components';
import { Label } from '@navikt/ds-react';
import { IGrunnlagsdataPeriodeHistorikkBarnetilsyn } from '../typer';
import HistorikkRadIBarnetilsyn from './HistorikkRadIBarnetilsyn';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, max-content);
    row-gap: 0.2rem;
    column-gap: 1rem;
`;
const Row = styled.div`
    display: contents;
`;
const KortInnholdBarnetilsyn: React.FC<{
    periodeHistorikkData: IGrunnlagsdataPeriodeHistorikkBarnetilsyn[] | undefined;
}> = ({ periodeHistorikkData }) => {
    return (
        <Grid>
            <Row>
                <Label>Periode</Label>
                <Label>Overlapper med overgangsstønad</Label>
            </Row>
            {periodeHistorikkData?.map((rad, i) => (
                <HistorikkRadIBarnetilsyn key={i} rad={rad} indeks={i} />
            ))}
        </Grid>
    );
};

export default KortInnholdBarnetilsyn;
