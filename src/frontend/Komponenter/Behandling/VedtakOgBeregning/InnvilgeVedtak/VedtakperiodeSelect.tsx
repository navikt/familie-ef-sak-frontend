import React, { FC } from 'react';
import {
    EBehandlingResultat,
    EPeriodeProperty,
    EPeriodetype,
    periodetypeTilTekst,
} from '../../../../App/typer/vedtak';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';
import { useToggles } from '../../../../App/context/TogglesContext';
import { ToggleName } from '../../../../App/context/toggles';

const StyledSelect = styled(FamilieSelect)`
    min-width: 140px;
    max-width: 200px;
    margin-right: 2rem;
`;

interface VedtakperiodeSelectProps {
    oppdaterVedtakslisteElement: (
        property: EPeriodeProperty,
        value: string | number | undefined
    ) => void;
    behandlingErRedigerbar: boolean;
    periodeType: EPeriodetype | '' | undefined;
    index: number;
    feil?: string;
    vedtaksresultatType: EBehandlingResultat;
}

const VedtakperiodeSelect: FC<VedtakperiodeSelectProps> = ({
    oppdaterVedtakslisteElement,
    behandlingErRedigerbar,
    periodeType,
    feil,
    vedtaksresultatType,
}) => {
    const { toggles } = useToggles();
    return (
        <StyledSelect
            aria-label="Periodetype"
            value={periodeType}
            feil={feil}
            onChange={(e) => {
                oppdaterVedtakslisteElement(EPeriodeProperty.periodeType, e.target.value);
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
            {toggles[ToggleName.innvilgeMedOpphørToggle] && (
                <option
                    value={EPeriodetype.MIDLERTIDIG_OPPHØR}
                    disabled={vedtaksresultatType !== EBehandlingResultat.INNVILGE_MED_OPPHØR}
                >
                    {periodetypeTilTekst[EPeriodetype.MIDLERTIDIG_OPPHØR]}
                </option>
            )}
        </StyledSelect>
    );
};

export default VedtakperiodeSelect;
