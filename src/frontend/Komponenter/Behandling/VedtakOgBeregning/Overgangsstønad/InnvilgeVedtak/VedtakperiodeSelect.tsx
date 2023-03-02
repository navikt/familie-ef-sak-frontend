import React, { FC } from 'react';
import {
    EPeriodetype,
    EVedtaksperiodeProperty,
    periodetypeTilTekst,
} from '../../../../../App/typer/vedtak';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';

interface VedtakperiodeSelectProps {
    oppdaterVedtakslisteElement: (
        property: EVedtaksperiodeProperty,
        value: string | number | undefined
    ) => void;
    className?: string;
    behandlingErRedigerbar: boolean;
    periodeType: EPeriodetype | '' | undefined;
    index: number;
    feil?: string;
}

const valgbarePeriodetyper = [
    EPeriodetype.PERIODE_FØR_FØDSEL,
    EPeriodetype.HOVEDPERIODE,
    EPeriodetype.NY_PERIODE_FOR_NYTT_BARN,
    EPeriodetype.UTVIDELSE,
    EPeriodetype.FORLENGELSE,
    EPeriodetype.MIDLERTIDIG_OPPHØR,
];

const VedtakperiodeSelect: FC<VedtakperiodeSelectProps> = ({
    className,
    oppdaterVedtakslisteElement,
    behandlingErRedigerbar,
    periodeType,
    feil,
}) => {
    return (
        <EnsligFamilieSelect
            className={className}
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
            {valgbarePeriodetyper.map((type) => (
                <option key={type} value={type}>
                    {periodetypeTilTekst[type]}
                </option>
            ))}
        </EnsligFamilieSelect>
    );
};

export default VedtakperiodeSelect;
