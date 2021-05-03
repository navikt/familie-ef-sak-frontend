import React, { FC } from 'react';
import { EPeriodeProperty, EPeriodetype, periodetypeTilTekst } from '../../../typer/vedtak';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';

const StyledSelect = styled(FamilieSelect)`
    min-width: 140px;
    max-width: 200px;
    margin-right: 2rem;
`;

interface VedtakperiodeSelectProps {
    oppdaterVedtakslisteElement: (
        index: number,
        property: EPeriodeProperty,
        value: string | number | undefined
    ) => void;
    behandlingErRedigerbar: boolean;
    periodeType: EPeriodetype;
    index: number;
    className?: string;
}

const VedtakperiodeSelect: FC<VedtakperiodeSelectProps> = ({
    oppdaterVedtakslisteElement,
    behandlingErRedigerbar,
    periodeType,
    index,
    className,
}) => {
    return (
        <StyledSelect
            className={className}
            aria-label={'Periodetype'}
            value={periodeType}
            onChange={(e) => {
                oppdaterVedtakslisteElement(index, EPeriodeProperty.periodeType, e.target.value);
            }}
            erLesevisning={!behandlingErRedigerbar}
            lesevisningVerdi={periodetypeTilTekst[periodeType]}
        >
            <option value="">Velg</option>
            <option value={EPeriodetype.PERIODE_FØR_FØDSEL}>
                {periodetypeTilTekst[EPeriodetype.PERIODE_FØR_FØDSEL]}
            </option>
            <option value={EPeriodetype.HOVEDPERIODE}>
                {periodetypeTilTekst[EPeriodetype.HOVEDPERIODE]}
            </option>
        </StyledSelect>
    );
};

export default VedtakperiodeSelect;
