import {
    EUtgiftsperiodeAktivitet,
    EUtgiftsperiodeProperty,
    EUtgiftsperiodetype,
    utgiftsperiodeAktivitetTilTekst,
} from '../../../../../App/typer/vedtak';
import React from 'react';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import { erOpphørEllerSanksjon } from '../Felles/utils';
import { OrNothing } from '../../../../../App/typer/common';

interface Props {
    periodetype: EUtgiftsperiodetype | undefined;
    aktivitet: EUtgiftsperiodeAktivitet | '' | undefined;
    oppdaterUtgiftsperiodeElement: (
        property: EUtgiftsperiodeProperty,
        value: string | undefined
    ) => void;
    erLesevisning: boolean;
    feil: OrNothing<string>;
}

const valgbareAktivitetstyper = [
    EUtgiftsperiodeAktivitet.FORBIGÅENDE_SYKDOM,
    EUtgiftsperiodeAktivitet.I_ARBEID,
];

const AktivitetSelect: React.FC<Props> = ({
    periodetype,
    aktivitet,
    oppdaterUtgiftsperiodeElement,
    erLesevisning,
    feil,
}) => {
    const skalIkkeVelgeAktivitet: boolean = !periodetype || erOpphørEllerSanksjon(periodetype);

    const utledLesevisningVerdi = () => {
        if (aktivitet) return utgiftsperiodeAktivitetTilTekst[aktivitet];
        if (erLesevisning || skalIkkeVelgeAktivitet) return '';
        return 'Ukjent';
    };

    return (
        <EnsligFamilieSelect
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
            erLesevisning={erLesevisning || skalIkkeVelgeAktivitet}
            lesevisningVerdi={utledLesevisningVerdi()}
        >
            <option value="">Velg</option>
            {valgbareAktivitetstyper.map((aktivitet) => (
                <option key={aktivitet} value={aktivitet}>
                    {utgiftsperiodeAktivitetTilTekst[aktivitet]}
                </option>
            ))}
        </EnsligFamilieSelect>
    );
};

export default AktivitetSelect;
