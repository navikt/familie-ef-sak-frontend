import React, { FC } from 'react';
import {
    EVedtaksperiodeProperty,
    EPeriodetype,
    periodetypeTilTekst,
} from '../../../../App/typer/vedtak';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';

const StyledSelect = styled(FamilieSelect)`
    min-width: 140px;
    max-width: 200px;
`;

interface VedtakperiodeSelectProps {
    oppdaterVedtakslisteElement: (
        property: EVedtaksperiodeProperty,
        value: string | number | undefined
    ) => void;
    behandlingErRedigerbar: boolean;
    periodeType: EPeriodetype | '' | undefined;
    index: number;
    feil?: string;
}

const VedtakperiodeSelect: FC<VedtakperiodeSelectProps> = ({
    oppdaterVedtakslisteElement,
    behandlingErRedigerbar,
    periodeType,
    feil,
}) => {
    return (
        <StyledSelect
            aria-label="Periodetype"
            value={periodeType}
            feil={feil}
            onChange={(e) => {
                oppdaterVedtakslisteElement(EVedtaksperiodeProperty.periodeType, e.target.value);
            }}
            erLesevisning={!behandlingErRedigerbar}
            lesevisningVerdi={periodeType && periodetypeTilTekst[periodeType]}
        >
            <option value="">Velg</option>
            <option value={EPeriodetype.FORLENGELSE}>
                {periodetypeTilTekst[EPeriodetype.FORLENGELSE]}
            </option>
            <option value={EPeriodetype.HOVEDPERIODE}>
                {periodetypeTilTekst[EPeriodetype.HOVEDPERIODE]}
            </option>
            <option value={EPeriodetype.PERIODE_FØR_FØDSEL}>
                {periodetypeTilTekst[EPeriodetype.PERIODE_FØR_FØDSEL]}
            </option>
            <option value={EPeriodetype.UTVIDELSE}>
                {periodetypeTilTekst[EPeriodetype.UTVIDELSE]}
            </option>
            <option value={EPeriodetype.MIDLERTIDIG_OPPHØR}>
                {periodetypeTilTekst[EPeriodetype.MIDLERTIDIG_OPPHØR]}
            </option>
        </StyledSelect>
    );
};

export default VedtakperiodeSelect;
