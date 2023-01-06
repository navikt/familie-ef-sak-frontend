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
        value: string | number | undefined
    ) => void;
    lesevisning: boolean;
    feil: OrNothing<string>;
}

const valgbareAktivitetstyper = [
    EUtgiftsperiodeAktivitet.FORBIGÅENDE_SYKDOM,
    EUtgiftsperiodeAktivitet.I_ARBEID,
];

const AktivitetSelect: React.FC<Props> = (props: Props) => {
    const { aktivitet, oppdaterUtgiftsperiodeElement, lesevisning, feil } = props;

    return (
        <StyledSelect
            label={'Aktivitet'}
            hideLabel
            value={aktivitet}
            error={feil}
            onChange={(e) => {
                oppdaterUtgiftsperiodeElement(
                    EUtgiftsperiodeProperty.aktivitetstype,
                    e.target.value
                );
            }}
            erLesevisning={lesevisning}
            lesevisningVerdi={aktivitet && utgiftsperiodeAktivitetTilTekst[aktivitet]}
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
