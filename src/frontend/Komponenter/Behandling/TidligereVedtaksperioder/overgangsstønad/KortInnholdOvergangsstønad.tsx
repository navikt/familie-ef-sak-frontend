import React from 'react';
import styled from 'styled-components';
import { Label } from '@navikt/ds-react';
import { IGrunnlagsdataPeriodeHistorikk } from '../typer';
import HistorikkRadIOvergangsstønad from './HistorikkRadIOvergangsstønad';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    row-gap: 0.2rem;
    column-gap: 1rem;
`;
const Row = styled.div`
    display: contents;
`;
const KortInnholdOvergangsstønad: React.FC<{
    periodeHistorikkData: IGrunnlagsdataPeriodeHistorikk[] | undefined;
}> = ({ periodeHistorikkData }) => {
    return (
        <Grid>
            <Row>
                <Label>Periode</Label>
                <Label>Periodetype</Label>
                <Label>Måneder med utbet.</Label>
                <Label>Måneder uten utbet.</Label>
            </Row>
            {periodeHistorikkData?.map((rad, i) => (
                <HistorikkRadIOvergangsstønad key={i} rad={rad} indeks={i} />
            ))}
        </Grid>
    );
};

export default KortInnholdOvergangsstønad;
