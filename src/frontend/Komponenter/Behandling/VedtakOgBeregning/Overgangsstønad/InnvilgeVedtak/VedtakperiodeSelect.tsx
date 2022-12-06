import React, { FC } from 'react';
import {
    EPeriodetype,
    EVedtaksperiodeProperty,
    periodetypeTilTekst,
} from '../../../../../App/typer/vedtak';
import styled from 'styled-components';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';

const StyledSelect = styled(EnsligFamilieSelect)`
    align-items: start;
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
            label="Periodetype"
            hideLabel
            value={periodeType}
            error={feil}
            onChange={(e) => {
                oppdaterVedtakslisteElement(EVedtaksperiodeProperty.periodeType, e.target.value);
            }}
            erLesevisning={!behandlingErRedigerbar || periodeType === EPeriodetype.SANKSJON}
            lesevisningVerdi={periodeType && periodetypeTilTekst[periodeType]}
        >
            <option value="">Velg</option>
            {[
                EPeriodetype.PERIODE_FØR_FØDSEL,
                EPeriodetype.HOVEDPERIODE,
                EPeriodetype.NY_PERIODE_FOR_NYTT_BARN,
                EPeriodetype.UTVIDELSE,
                EPeriodetype.FORLENGELSE,
                EPeriodetype.MIDLERTIDIG_OPPHØR,
            ].map((type) => (
                <option key={type} value={type}>
                    {periodetypeTilTekst[type]}
                </option>
            ))}
        </StyledSelect>
    );
};

export default VedtakperiodeSelect;
