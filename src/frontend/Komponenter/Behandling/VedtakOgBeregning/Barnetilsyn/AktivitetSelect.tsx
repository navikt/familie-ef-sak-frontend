import { utgiftsperiodeAktivitetTilTekst } from '../../../../App/typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { OrNothing } from '../../../../App/hooks/felles/useSorteringState';
import { EnsligFamilieSelect } from '../../../../Felles/Input/EnsligFamilieSelect';
import { EUtgiftsperiodeAktivitet, EUtgiftsperiodeProperty } from '../../../../App/typer/vedtak';

const StyledSelect = styled(EnsligFamilieSelect)`
    align-items: start;
    min-width: 140px;
    max-width: 200px;
`;

interface Props {
    aktivitet: EUtgiftsperiodeAktivitet | '' | undefined;
    oppdaterUtgiftsperiodeElement: (
        property: EUtgiftsperiodeProperty,
        value: string | undefined
    ) => void;
    erLesevisning: boolean;
    erMidlertidigOpphør: boolean;
    feil: OrNothing<string>;
}

const valgbareAktivitetstyper = [
    EUtgiftsperiodeAktivitet.FORBIGÅENDE_SYKDOM,
    EUtgiftsperiodeAktivitet.I_ARBEID,
];

const AktivitetSelect: React.FC<Props> = ({
    aktivitet,
    oppdaterUtgiftsperiodeElement,
    erLesevisning,
    erMidlertidigOpphør,
    feil,
}) => {
    const utledLesevisningVerdi = () => {
        if (aktivitet) return utgiftsperiodeAktivitetTilTekst[aktivitet];
        if (erLesevisning && erMidlertidigOpphør) return '';
        return 'Ukjent';
    };

    return (
        <StyledSelect
            label={'Aktivitet'}
            hideLabel
            value={erMidlertidigOpphør ? '' : aktivitet}
            error={feil}
            onChange={(e) => {
                oppdaterUtgiftsperiodeElement(
                    EUtgiftsperiodeProperty.aktivitetstype,
                    e.target.value
                );
            }}
            erLesevisning={erLesevisning}
            lesevisningVerdi={utledLesevisningVerdi()}
            disabled={erMidlertidigOpphør}
            size={'small'}
        >
            <option value="">Velg</option>
            {valgbareAktivitetstyper.map((aktivitet) => (
                <option key={aktivitet} value={aktivitet}>
                    {utgiftsperiodeAktivitetTilTekst[aktivitet]}
                </option>
            ))}
        </StyledSelect>
    );
};

export default AktivitetSelect;
