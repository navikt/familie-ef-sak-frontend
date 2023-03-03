import React, { FC } from 'react';
import {
    EUtgiftsperiodeProperty,
    EUtgiftsperiodetype,
    utgiftsperiodetypeTilTekst,
} from '../../../../App/typer/vedtak';
import { EnsligFamilieSelect } from '../../../../Felles/Input/EnsligFamilieSelect';

interface Props {
    className?: string;
    feil?: string;
    lesevisning: boolean;
    oppdaterUtgiftsperiodeElement: (
        property: EUtgiftsperiodeProperty,
        value: string | undefined
    ) => void;
    periodetype: EUtgiftsperiodetype | '' | undefined;
}

const valgbarePeriodetyper = [EUtgiftsperiodetype.ORDINÆR, EUtgiftsperiodetype.OPPHØR];

const PeriodetypeSelect: FC<Props> = ({
    className,
    feil,
    lesevisning,
    oppdaterUtgiftsperiodeElement,
    periodetype,
}) => {
    return (
        <EnsligFamilieSelect
            className={className}
            erLesevisning={lesevisning || periodetype === EUtgiftsperiodetype.SANKSJON_1_MND}
            error={feil}
            hideLabel
            label="Periodetype"
            lesevisningVerdi={periodetype && utgiftsperiodetypeTilTekst[periodetype]}
            onChange={(e) => {
                oppdaterUtgiftsperiodeElement(EUtgiftsperiodeProperty.periodetype, e.target.value);
            }}
            value={periodetype}
        >
            <option value="">Velg</option>
            {valgbarePeriodetyper.map((type) => (
                <option key={type} value={type}>
                    {utgiftsperiodetypeTilTekst[type]}
                </option>
            ))}
        </EnsligFamilieSelect>
    );
};

export default PeriodetypeSelect;
