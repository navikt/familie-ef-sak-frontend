import React from 'react';
import { ITidligereVedtaksperioder } from './typer';
import styled from 'styled-components';
import { BodyShort, Heading, Label, Tag } from '@navikt/ds-react';
import { etikettTypeOvergangsstønad } from '../../Personoversikt/HistorikkVedtaksperioder/vedtakshistorikkUtil';
import { periodetypeTilTekst } from '../../../App/typer/vedtak';

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
    // TODO: Legg til dager i periode
    return (
        <>
            {sak && ( // TODO: Endre tekst som vises hvis det ikke finnes noe data
                <Container>
                    <Tittel level="3" size="small">
                        Historikk i EF Sak
                    </Tittel>
                    {sak?.periodeHistorikkOvergangsstønad.length > 0 ? (
                        <Grid>
                            <Row>
                                <Label>Periode</Label>
                                <Label>Periodetype</Label>
                                <Label>Måneder innvilget</Label>
                            </Row>
                            {sak?.periodeHistorikkOvergangsstønad.map((rad, i) => (
                                <Row key={i}>
                                    <BodyShort size="small">
                                        {rad.periode.fom === rad.periode.tom
                                            ? `${rad.periode.fom}`
                                            : `${rad.fomDato} - ${rad.periode.tom}`}
                                    </BodyShort>
                                    <div>
                                        <Tag
                                            variant={etikettTypeOvergangsstønad(rad.periodeType)}
                                            size={'small'}
                                        >
                                            {periodetypeTilTekst[rad.periodeType || '']}
                                        </Tag>
                                    </div>
                                    <BodyShort size="small">{rad.antMnd}</BodyShort>
                                </Row>
                            ))}
                        </Grid>
                    ) : (
                        <BodyShort size="small">Kan ikke vise tidligere historikk.</BodyShort>
                    )}
                </Container>
            )}

            {infotrygd && (
                <Container>
                    <Tittel level="3" size="small">
                        Historikk i Infotrygd
                    </Tittel>
                    <BodyShort size="small">
                        Bruker har historikk i Infotrygd som må sjekkes manuelt.
                    </BodyShort>
                </Container>
            )}
        </>
    );
};
