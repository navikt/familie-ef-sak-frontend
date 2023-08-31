import React from 'react';
import { ITidligereVedtaksperioder } from './typer';
import styled from 'styled-components';
import { BodyShort, Heading, Label } from '@navikt/ds-react';

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
    grid-template-columns: auto auto auto;
    gap: 0.2rem;
`;

const Row = styled.div`
    display: contents;
`;

export const OSHistorikKort: React.FC<ITidligereVedtaksperioder> = ({ infotrygd, sak }) => {
    if (!infotrygd && !sak) {
        return null;
    }

    // const harØyeblikksbildeAvInfotrygd = sak?.øyeblikksbildeAvPerioderOgPeriodetype?.length || 0;

    // if (infotrygd?.harTidligereOvergangsstønad && harØyeblikksbildeAvInfotrygd > 0) {
    //     return (
    //         <Container>
    //             <Tittel level="3" size="small">
    //                 Historikk i Infotrygd
    //             </Tittel>
    //             <BodyShort>
    //                 Bruker har historikk i Infotrygd som må sjekkes manuelt bla bla
    //             </BodyShort>
    //         </Container>
    //     );
    // }

    const harØyeblikksbildeAvOS = sak?.øyeblikksbildeAvPerioderOgPeriodetype?.length || 0;

    if (harØyeblikksbildeAvOS > 0) {
        return (
            <Container>
                <Tittel level="3" size="small">
                    Historikk i EF Sak
                </Tittel>
                <Grid>
                    <Row>
                        <Label>Periode</Label>
                        <Label>Periodetype</Label>
                        <Label>Måneder innvilget</Label>
                    </Row>
                    {sak?.øyeblikksbildeAvPerioderOgPeriodetype.map((rad, i) => (
                        <Row key={i}>
                            <BodyShort>
                                {rad.periode.fom} - {rad.periode.fom}
                            </BodyShort>
                            <BodyShort>{rad.periodeType}</BodyShort>
                            <BodyShort>XXX</BodyShort>
                        </Row>
                    ))}
                </Grid>
            </Container>
        );
    }
};
