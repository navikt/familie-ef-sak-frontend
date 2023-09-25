import React from 'react';
import { IGrunnlagsdataPeriodeHistorikk } from './typer';
import styled from 'styled-components';
import { BodyShort, Heading, Label } from '@navikt/ds-react';
import HistorikkRad from './HistorikkRad';
import { Stønadstype } from '../../../App/typer/behandlingstema';

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
    historikkISak: IGrunnlagsdataPeriodeHistorikk[] | undefined;
    stønadstype: string;
}> = ({ historikkISak, stønadstype }) => {
    const erOvergansstønad = stønadstype === Stønadstype.OVERGANGSSTØNAD;

    return (
        <>
            {historikkISak && (
                <Container>
                    <Tittel level="3" size="small">
                        Historikk i EF Sak
                    </Tittel>
                    {erOvergansstønad && historikkISak?.length > 0 ? (
                        <Grid>
                            <Row>
                                <Label>Periode</Label>
                                <Label>Periodetype</Label>
                                <Label>Måneder innvilget</Label>
                                <Label>Har 0 beløp</Label>
                            </Row>
                            {historikkISak?.map((rad, i) => (
                                <HistorikkRad key={i} rad={rad} index={i} />
                            ))}
                        </Grid>
                    ) : (
                        <BodyShort size="small">Kan ikke vise tidligere historikk.</BodyShort>
                    )}
                </Container>
            )}
        </>
    );
};

export default HistorikkIEfKort;
