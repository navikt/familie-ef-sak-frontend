import React from 'react';
import { IGrunnlagsdataPeriodeHistorikk } from './typer';
import styled from 'styled-components';
import { BodyShort, Heading, Label } from '@navikt/ds-react';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import HistorikkRadIOvergangsstønad from './HistorikkRadIOvergangsstønad';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #f3fcf5;
    padding: 1rem;
    border: 1px solid rgba(0, 0, 0, 0.19);
    border-radius: 6px;
    text-align: left;
`;

const Tittel = styled(Heading)`
    text-decoration: underline;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 0.2rem;
`;

const Row = styled.div`
    display: contents;
`;

const HistorikkIEfKort: React.FC<{
    periodeHistorikkData: IGrunnlagsdataPeriodeHistorikk[] | undefined;
    stønadstype: string;
}> = ({ periodeHistorikkData, stønadstype }) => {
    const erOvergansstønadMedData =
        stønadstype === Stønadstype.OVERGANGSSTØNAD &&
        periodeHistorikkData &&
        periodeHistorikkData?.length > 0;

    return (
        <>
            <Container>
                <Tittel level="3" size="small">
                    Historikk i EF Sak
                </Tittel>
                {erOvergansstønadMedData ? (
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
                ) : (
                    <BodyShort size="small">Kan ikke vise tidligere historikk.</BodyShort>
                )}
            </Container>
        </>
    );
};

export default HistorikkIEfKort;
