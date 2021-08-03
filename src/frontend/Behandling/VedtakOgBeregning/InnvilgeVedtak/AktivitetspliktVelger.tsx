import {
    aktivitetTilTekst,
    EAktivitet,
    EPeriodeProperty,
    EPeriodetype,
} from '../../../typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';
import { Normaltekst } from 'nav-frontend-typografi';
import { OrNothing } from '../../../hooks/felles/useSorteringState';

interface Props {
    periodeType: EPeriodetype | '' | undefined;
    aktivitet: EAktivitet | '' | undefined;
    index: number;
    oppdaterVedtakslisteElement: (index: number, property: EPeriodeProperty, value: string) => void;
    erLesevisning: boolean;
    aktivitetfeil: OrNothing<string>;
}

const StyledSelect = styled(FamilieSelect)`
    margin-right: 2rem;
`;

const AktivitetKolonne = styled.div`
    .typo-normal {
        padding: 0.5rem 0 1rem 0;
    }
`;

const AktivitetspliktVelger: React.FC<Props> = (props: Props) => {
    const {
        periodeType,
        aktivitet,
        index,
        oppdaterVedtakslisteElement,
        erLesevisning,
        aktivitetfeil,
    } = props;

    switch (periodeType) {
        case EPeriodetype.HOVEDPERIODE:
            return (
                <StyledSelect
                    aria-label={'Aktivitet'}
                    value={aktivitet}
                    feil={aktivitetfeil}
                    onChange={(e) => {
                        oppdaterVedtakslisteElement(
                            index,
                            EPeriodeProperty.aktivitet,
                            e.target.value
                        );
                    }}
                    erLesevisning={erLesevisning}
                    lesevisningVerdi={aktivitet && aktivitetTilTekst[aktivitet]}
                >
                    <option value="">Velg</option>
                    <optgroup label="Ingen aktivitetsplikt">
                        <option value={EAktivitet.BARN_UNDER_ETT_ÅR}>
                            {aktivitetTilTekst[EAktivitet.BARN_UNDER_ETT_ÅR]}
                        </option>
                    </optgroup>
                    <optgroup label="Fyller aktivitetsplikt">
                        <option value={EAktivitet.FORSØRGER_I_ARBEID}>
                            {aktivitetTilTekst[EAktivitet.FORSØRGER_I_ARBEID]}
                        </option>
                        <option value={EAktivitet.FORSØRGER_I_UTDANNING}>
                            {aktivitetTilTekst[EAktivitet.FORSØRGER_I_UTDANNING]}
                        </option>
                        <option value={EAktivitet.FORSØRGER_REELL_ARBEIDSSØKER}>
                            {aktivitetTilTekst[EAktivitet.FORSØRGER_REELL_ARBEIDSSØKER]}
                        </option>
                        <option value={EAktivitet.FORSØRGER_ETABLERER_VIRKSOMHET}>
                            {aktivitetTilTekst[EAktivitet.FORSØRGER_ETABLERER_VIRKSOMHET]}
                        </option>
                    </optgroup>
                    <optgroup label="Fyller unntak for aktivitetsplikt">
                        <option value={EAktivitet.BARNET_SÆRLIG_TILSYNSKREVENDE}>
                            {aktivitetTilTekst[EAktivitet.BARNET_SÆRLIG_TILSYNSKREVENDE]}
                        </option>
                        <option value={EAktivitet.FORSØRGER_MANGLER_TILSYNSORDNING}>
                            {aktivitetTilTekst[EAktivitet.FORSØRGER_MANGLER_TILSYNSORDNING]}
                        </option>
                        <option value={EAktivitet.FORSØRGER_ER_SYK}>
                            {aktivitetTilTekst[EAktivitet.FORSØRGER_ER_SYK]}
                        </option>
                        <option value={EAktivitet.BARNET_ER_SYKT}>
                            {aktivitetTilTekst[EAktivitet.BARNET_ER_SYKT]}
                        </option>
                    </optgroup>
                </StyledSelect>
            );
        case EPeriodetype.PERIODE_FØR_FØDSEL:
            return (
                <AktivitetKolonne>
                    <Normaltekst>Ikke aktivitetsplikt</Normaltekst>
                </AktivitetKolonne>
            );
        default:
            return (
                <AktivitetKolonne>
                    <Normaltekst>-</Normaltekst>
                </AktivitetKolonne>
            );
    }
};
export default AktivitetspliktVelger;
