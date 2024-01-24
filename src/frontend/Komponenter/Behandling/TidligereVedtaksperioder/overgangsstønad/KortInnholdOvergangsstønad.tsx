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

    @media (max-width: 1024px) {
        grid-template-columns: repeat(3, max-content);
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, max-content);
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
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
