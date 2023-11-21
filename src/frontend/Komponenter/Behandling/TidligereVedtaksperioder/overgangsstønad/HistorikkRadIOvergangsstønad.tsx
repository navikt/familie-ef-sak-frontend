import React from 'react';
import { BodyShort, Tag } from '@navikt/ds-react';
import { periodetypeTilTekst, EPeriodetype } from '../../../../App/typer/vedtak';
import { formaterIsoDato } from '../../../../App/utils/formatter';
import { etikettTypeOvergangsstønad } from '../../../Personoversikt/HistorikkVedtaksperioder/vedtakshistorikkUtil';
import { IGrunnlagsdataPeriodeHistorikkOvergangsstønad } from '../typer';
import styled from 'styled-components';

interface HistorikkRadProps {
    rad: IGrunnlagsdataPeriodeHistorikkOvergangsstønad;
    indeks: number;
}

const Row = styled.div`
    display: contents;
`;

const HistorikkRadIOvergangsstønad: React.FC<HistorikkRadProps> = ({ rad, indeks }) => {
    return (
        <Row key={indeks}>
            <BodyShort size="small">
                {`${formaterIsoDato(rad.fom)} 
            - 
            ${formaterIsoDato(rad.tom)}`}
            </BodyShort>
            <div>
                <Tag variant={etikettTypeOvergangsstønad(rad.vedtaksperiodeType)} size={'small'}>
                    {periodetypeTilTekst[rad.vedtaksperiodeType || '']}
                </Tag>
            </div>
            <BodyShort size="small">{rad.antallMåneder}</BodyShort>
            <BodyShort size="small">
                {rad.antallMånederUtenBeløp !== undefined &&
                rad.antallMånederUtenBeløp >= 1 &&
                rad.vedtaksperiodeType !== EPeriodetype.SANKSJON
                    ? rad.antallMånederUtenBeløp
                    : '-'}
            </BodyShort>
        </Row>
    );
};

export default HistorikkRadIOvergangsstønad;
