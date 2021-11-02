import {
    aktiviteterForPeriodetype,
    aktiviteterForPeriodetypeHoved,
    aktivitetTilTekst,
    EAktivitet,
    EPeriodeProperty,
    EPeriodetype,
} from '../../../../App/typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';
import { Normaltekst } from 'nav-frontend-typografi';
import { OrNothing } from '../../../../App/hooks/felles/useSorteringState';

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
    const labels = [
        'Ingen aktivitetsplikt',
        'Fyller aktivitetsplikt',
        'Fyller unntak for aktivitetsplikt',
    ];

    switch (periodeType) {
        case EPeriodetype.FORLENGELSE:
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
                    <option value="" key={'option'}>
                        Velg
                    </option>
                    {aktiviteterForPeriodetype(EPeriodetype.FORLENGELSE).map((aktivitet, index) => {
                        return (
                            <option value={aktivitet} key={index}>
                                {aktivitetTilTekst[aktivitet]}
                            </option>
                        );
                    })}
                </StyledSelect>
            );
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
                    <option value="" key={'option'}>
                        Velg
                    </option>
                    {aktiviteterForPeriodetypeHoved().map((aktivitetsListe, index) => {
                        return (
                            <optgroup label={labels[index]} key={index}>
                                {aktivitetsListe.map((aktivitet, index) => {
                                    return (
                                        <option value={aktivitet} key={index}>
                                            {aktivitetTilTekst[aktivitet]}
                                        </option>
                                    );
                                })}
                            </optgroup>
                        );
                    })}
                </StyledSelect>
            );
        case EPeriodetype.UTVIDELSE:
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
                    <option value="" key={'option'}>
                        Velg
                    </option>
                    {aktiviteterForPeriodetype(EPeriodetype.UTVIDELSE).map((aktivitet, index) => {
                        return (
                            <option value={aktivitet} key={index}>
                                {aktivitetTilTekst[aktivitet]}
                            </option>
                        );
                    })}
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
