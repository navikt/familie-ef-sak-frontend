import React from 'react';
import styled from 'styled-components';
import { Label } from '@navikt/ds-react';
import { IGrunnlagsdataPeriodeHistorikkOvergangsstønad } from '../typer';
import HistorikkRadIOvergangsstønad from './HistorikkRadIOvergangsstønad';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(auto, max-content));
    row-gap: 0.2rem;
    column-gap: 1rem;
    text-overflow: ellipsis;
`;

const Row = styled.div`
    display: contents;
`;
const KortInnholdOvergangsstønad: React.FC<{
    periodeHistorikkData: IGrunnlagsdataPeriodeHistorikkOvergangsstønad[] | undefined;
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
