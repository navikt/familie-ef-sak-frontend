import React from 'react';
import { BodyShort } from '@navikt/ds-react';
import { formaterIsoDato } from '../../../../App/utils/formatter';
import styled from 'styled-components';
import { IGrunnlagsdataPeriodeHistorikk } from '../typer';

interface HistorikkRadProps {
    rad: IGrunnlagsdataPeriodeHistorikk;
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
        </Row>
    );
};

export default HistorikkRadIBarnetilsyn;
