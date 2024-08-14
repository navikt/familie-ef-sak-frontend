import {
    aktiviteterForPeriodetype,
    aktiviteterForPeriodetypeHoved,
    aktivitetTilTekst,
    EAktivitet,
    EVedtaksperiodeProperty,
    EPeriodetype,
} from '../../../../../App/typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import { BodyShort } from '@navikt/ds-react';
import { OrNothing } from '../../../../../App/typer/common';

interface Props {
    periodeType: EPeriodetype | '' | undefined;
    aktivitet: EAktivitet | '' | undefined;
    index: number;
    oppdaterVedtakslisteElement: (
        index: number,
        property: EVedtaksperiodeProperty,
        value: string
    ) => void;
    erLesevisning: boolean;
    aktivitetfeil: OrNothing<string>;
}

const AktivitetKolonne = styled.div<{ $medPadding?: boolean }>`
    .navds-body-short {
        padding: ${(props) => (props.$medPadding ? '0.5rem 0 1rem 0' : '0rem')};
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
                <EnsligFamilieSelect
                    label={'Velg aktivitet'}
                    hideLabel
                    value={aktivitet || ''}
                    error={aktivitetfeil}
                    onChange={(e) => {
                        oppdaterVedtakslisteElement(
                            index,
                            EVedtaksperiodeProperty.aktivitet,
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
                </EnsligFamilieSelect>
            );
        case EPeriodetype.HOVEDPERIODE:
        case EPeriodetype.NY_PERIODE_FOR_NYTT_BARN:
            return (
                <EnsligFamilieSelect
                    label={'Velg aktivitet'}
                    hideLabel
                    value={aktivitet || ''}
                    error={aktivitetfeil}
                    onChange={(e) => {
                        oppdaterVedtakslisteElement(
                            index,
                            EVedtaksperiodeProperty.aktivitet,
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
                </EnsligFamilieSelect>
            );
        case EPeriodetype.UTVIDELSE:
            return (
                <EnsligFamilieSelect
                    label={'Velg aktivitet'}
                    hideLabel
                    value={aktivitet || ''}
                    error={aktivitetfeil}
                    onChange={(e) => {
                        oppdaterVedtakslisteElement(
                            index,
                            EVedtaksperiodeProperty.aktivitet,
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
                </EnsligFamilieSelect>
            );
        case EPeriodetype.PERIODE_FØR_FØDSEL:
            return (
                <AktivitetKolonne $medPadding={!erLesevisning}>
                    <BodyShort>Ikke aktivitetsplikt</BodyShort>
                </AktivitetKolonne>
            );
        default:
            return (
                <AktivitetKolonne $medPadding={!erLesevisning}>
                    <BodyShort>-</BodyShort>
                </AktivitetKolonne>
            );
    }
};
export default AktivitetspliktVelger;
