import React from 'react';
import { BodyShort, Tag } from '@navikt/ds-react';
import { periodetypeTilTekst, EPeriodetype } from '../../../App/typer/vedtak';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { etikettTypeOvergangsstønad } from '../../Personoversikt/HistorikkVedtaksperioder/vedtakshistorikkUtil';
import { IGrunnlagsdataPeriodeHistorikk } from './typer';
import styled from 'styled-components';

interface HistorikkRadProps {
    rad: IGrunnlagsdataPeriodeHistorikk;
    index: number;
}

const Row = styled.div`
    display: contents;
`;

const HistorikkRad: React.FC<HistorikkRadProps> = ({ rad, index }) => {
    return (
        <Row key={index}>
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
                {rad.antallMånederUtenBeløp >= 1 && rad.vedtaksperiodeType !== EPeriodetype.SANKSJON
                    ? `ja (${rad.antallMånederUtenBeløp})`
                    : '-'}
            </BodyShort>
        </Row>
    );
};

export default HistorikkRad;
