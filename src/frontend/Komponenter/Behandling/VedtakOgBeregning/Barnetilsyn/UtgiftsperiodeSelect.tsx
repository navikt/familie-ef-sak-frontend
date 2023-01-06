import React, { FC } from 'react';
import {
    EUtgiftsperiodeProperty,
    EUtgiftsperiodetype,
    utgiftsperiodetypeTilTekst,
} from '../../../../App/typer/vedtak';
import styled from 'styled-components';
import { EnsligFamilieSelect } from '../../../../Felles/Input/EnsligFamilieSelect';

const StyledSelect = styled(EnsligFamilieSelect)`
    align-items: start;
    min-width: 140px;
    max-width: 200px;
`;

interface Props {
    periodetype: EUtgiftsperiodetype | '' | undefined;
    oppdaterUtgiftsperiodeElement: (
        property: EUtgiftsperiodeProperty,
        value: string | number | undefined
    ) => void;
    lesevisning: boolean;
    feil?: string;
}

const valgbarePeriodetyper = [
    EUtgiftsperiodetype.ORDINÆR,
    EUtgiftsperiodetype.OPPHØR,
    EUtgiftsperiodetype.SANKSJON_1_MND,
];

const UtgiftsperiodeSelect: FC<Props> = (props: Props) => {
    const { periodetype, oppdaterUtgiftsperiodeElement, lesevisning, feil } = props;

    return (
        <StyledSelect
            label="Periodetype"
            hideLabel
            value={periodetype}
            error={feil}
            onChange={(e) => {
                oppdaterUtgiftsperiodeElement(EUtgiftsperiodeProperty.periodetype, e.target.value);
            }}
            erLesevisning={lesevisning}
            lesevisningVerdi={periodetype && utgiftsperiodetypeTilTekst[periodetype]}
        >
            <option value="">Velg</option>
            {valgbarePeriodetyper.map((type) => (
                <option key={type} value={type}>
                    {utgiftsperiodetypeTilTekst[type]}
                </option>
            ))}
        </StyledSelect>
    );
};

export default UtgiftsperiodeSelect;
