import React from 'react';
import styled from 'styled-components';
import { Label } from '@navikt/ds-react';
import { IGrunnlagsdataPeriodeHistorikk } from '../typer';
import HistorikkRadIBarnetilsyn from './HistorikkRadIBarnetilsyn';

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto;
    row-gap: 0.2rem;
`;
const Row = styled.div`
    display: contents;
`;
const KortInnholdBarnetilsyn: React.FC<{
    periodeHistorikkData: IGrunnlagsdataPeriodeHistorikk[] | undefined;
}> = ({ periodeHistorikkData }) => {
    return (
        <Grid>
            <Row>
                <Label>Periode</Label>
            </Row>
            {periodeHistorikkData?.map((rad, i) => (
                <HistorikkRadIBarnetilsyn key={i} rad={rad} indeks={i} />
            ))}
        </Grid>
    );
};

export default KortInnholdBarnetilsyn;
