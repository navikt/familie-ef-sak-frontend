import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { formaterIsoDato } from '../../../../App/utils/formatter';
import styled from 'styled-components';
import { IGrunnlagsdataPeriodeHistorikkBarnetilsyn, OverlappMedOvergangsstønad } from '../typer';
import { Tag } from '@navikt/ds-react';
import { etikettTypeOverlappBarnetilsyn } from '../../../Personoversikt/HistorikkVedtaksperioder/vedtakshistorikkUtil';

interface HistorikkRadProps {
    rad: IGrunnlagsdataPeriodeHistorikkBarnetilsyn;
    indeks: number;
}

const Row = styled.div`
    display: contents;
`;

const HistorikkRadIBarnetilsyn: React.FC<HistorikkRadProps> = ({ rad, indeks }) => {
    return (
        <Row key={indeks}>
            <BodyShort size="small">
                {`${formaterIsoDato(rad.fom)} 
            - 
            ${formaterIsoDato(rad.tom)}`}
            </BodyShort>
            <BodyShort size="small">
                <Tag
                    variant={etikettTypeOverlappBarnetilsyn(rad.overlappMedOvergangsstønad)}
                    size={'small'}
                >
                    {OverlappMedOvergangsstønad[rad.overlappMedOvergangsstønad]}
                </Tag>
            </BodyShort>
        </Row>
    );
};

export default HistorikkRadIBarnetilsyn;
