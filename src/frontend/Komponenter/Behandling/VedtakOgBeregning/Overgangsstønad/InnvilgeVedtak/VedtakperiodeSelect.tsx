import React, { FC } from 'react';
import {
    EPeriodetype,
    EVedtaksperiodeProperty,
    periodetypeTilTekst,
} from '../../../../../App/typer/vedtak';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import { useBehandling } from '../../../../../App/context/BehandlingContext.tsx';

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

const valgbarePeriodetyper2026Regelendring = [
    EPeriodetype.PERIODE_FØR_FØDSEL,
    EPeriodetype.BARN_UNDER_14_MÅNEDER,
    EPeriodetype.SÆRLIG_TILSYNSKREVENDE_BARN,
    EPeriodetype.FORBIGÅENDE_SYKDOM_HOS_BARNET,
];

const VedtakperiodeSelect: FC<VedtakperiodeSelectProps> = ({
    className,
    oppdaterVedtakslisteElement,
    behandlingErRedigerbar,
    periodeType,
    feil,
}) => {
    const { erRegelendring2026 } = useBehandling();
    const relevantePeriodeTyper = erRegelendring2026
        ? valgbarePeriodetyper2026Regelendring
        : valgbarePeriodetyper;

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
            {relevantePeriodeTyper.map((type) => (
                <option key={type} value={type}>
                    {periodetypeTilTekst[type]}
                </option>
            ))}
        </EnsligFamilieSelect>
    );
};

export default VedtakperiodeSelect;
