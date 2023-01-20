import {
    EUtgiftsperiodeAktivitet,
    EUtgiftsperiodeProperty,
    EUtgiftsperiodetype,
    utgiftsperiodeAktivitetTilTekst,
} from '../../../../App/typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { OrNothing } from '../../../../App/hooks/felles/useSorteringState';
import { EnsligFamilieSelect } from '../../../../Felles/Input/EnsligFamilieSelect';
import { BodyShort } from '@navikt/ds-react';
import { erOpphørEllerSanksjon } from './utils';

const StyledSelect = styled(EnsligFamilieSelect)`
    align-items: start;
    min-width: 140px;
    max-width: 200px;
`;

const AktivitetKolonne = styled.div<{ medPadding?: boolean }>`
    .navds-body-short {
        padding: ${(props) => (props.medPadding ? '0.25rem 0 0 0' : '0')};
    }
`;

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
    if (skalIkkeVelgeAktivitet) {
        return (
            <AktivitetKolonne
                medPadding={!erLesevisning && periodetype !== EUtgiftsperiodetype.SANKSJON_1_MND}
            >
                <BodyShort size={erLesevisning ? 'small' : 'medium'}>-</BodyShort>
            </AktivitetKolonne>
        );
    }

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
            erLesevisning={erLesevisning}
            lesevisningVerdi={aktivitet ? utgiftsperiodeAktivitetTilTekst[aktivitet] : 'Ukjent'}
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
