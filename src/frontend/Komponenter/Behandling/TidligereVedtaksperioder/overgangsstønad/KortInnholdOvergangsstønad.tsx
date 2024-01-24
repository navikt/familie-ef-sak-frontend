import React from 'react';
import styled from 'styled-components';
import { Label } from '@navikt/ds-react';
import { IGrunnlagsdataPeriodeHistorikkOvergangsstønad } from '../typer';
import HistorikkRadIOvergangsstønad from './HistorikkRadIOvergangsstønad';

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    row-gap: 0.2rem;
    column-gap: 1rem;

    @media (max-width: 1300px) {
        grid-template-columns: repeat(3, max-content);
    }

    @media (max-width: 1000px) {
        grid-template-columns: repeat(2, max-content);
    }

    @media (max-width: 700px) {
        grid-template-columns: repeat(1, max-content);
    }
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
