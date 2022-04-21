import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Radio } from 'nav-frontend-skjema';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Element } from 'nav-frontend-typografi';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import {
    ERadioValg,
    ETilleggsstønadPeriodeProperty,
    IPeriodeMedBeløp,
    radiovalgTilTekst,
} from '../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { useApp } from '../../../../App/context/AppContext';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../App/utils/utils';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import { FieldState } from '../../../../App/hooks/felles/useFieldState';
import { EnsligTextArea } from '../../../../Felles/Input/TekstInput/EnsligTextArea';
import { FamilieRadioGruppe } from '@navikt/familie-form-elements';

const TilleggsstønadPeriodeContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger tilOgMedVelger kontantstøtte slettKnapp';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 10rem 7rem 7rem 7rem' : '12rem 12rem 8rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: 0.75rem;
`;

const KolonneHeaderWrapper = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger tilOgMedVelger kontantstøtte';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 10rem 7rem' : '12rem 12rem 8rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: 0.5rem;
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;

interface Props {
    tilleggsstønad: FieldState;
    tilleggsstønadBegrunnelse: FieldState;
    stønadsreduksjon: FieldState;
    tilleggsstønadPerioder: ListState<IPeriodeMedBeløp>;
    valideringsfeil: FormErrors<InnvilgeVedtakForm>;
    settValideringsfeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

export const tomTilleggsstønadRad: IPeriodeMedBeløp = {
    årMånedFra: '',
    årMånedTil: '',
    beløp: undefined,
};

const TilleggsstønadValg: React.FC<Props> = ({
    tilleggsstønad,
    tilleggsstønadBegrunnelse,
    stønadsreduksjon,
    tilleggsstønadPerioder,
    valideringsfeil,
    settValideringsfeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    useEffect(() => {
        if (tilleggsstønad.value === ERadioValg.NEI) {
            stønadsreduksjon.setValue(ERadioValg.IKKE_SATT);
        }
    }, [stønadsreduksjon, tilleggsstønad]);

    const oppdaterTilleggsstønadPeriode = (
        index: number,
        property: ETilleggsstønadPeriodeProperty,
        value: string | string[] | number | undefined
    ) => {
        tilleggsstønadPerioder.update(
            {
                ...tilleggsstønadPerioder.value[index],
                [property]: value,
            },
            index
        );
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
    };

    const periodeVariantTilleggsstønadPeriodeProperty = (
        periodeVariant: PeriodeVariant
    ): ETilleggsstønadPeriodeProperty => {
        switch (periodeVariant) {
            case PeriodeVariant.ÅR_MÅNED_FRA:
                return ETilleggsstønadPeriodeProperty.årMånedFra;
            case PeriodeVariant.ÅR_MÅNED_TIL:
                return ETilleggsstønadPeriodeProperty.årMånedTil;
        }
    };

    return (
        <>
            <FamilieRadioGruppe
                legend="Er det søkt om, utbetales det eller har det blitt utbetalt stønad for utgifter til tilsyn av barn etter tilleggsstønadsforskriften?"
                feil={valideringsfeil.harTilleggsstønad}
                erLesevisning={!behandlingErRedigerbar}
                verdi={radiovalgTilTekst[tilleggsstønad.value as ERadioValg]}
            >
                <Radio
                    name={'Tilleggsstønad'}
                    label={'Ja'}
                    value={ERadioValg.JA}
                    checked={tilleggsstønad.value === ERadioValg.JA}
                    onChange={(event) => tilleggsstønad.onChange(event)}
                />
                <Radio
                    name={'Tilleggsstønad'}
                    label={'Nei'}
                    value={ERadioValg.NEI}
                    checked={tilleggsstønad.value === ERadioValg.NEI}
                    onChange={(event) => tilleggsstønad.onChange(event)}
                />
            </FamilieRadioGruppe>
            {tilleggsstønad.value === ERadioValg.JA && (
                <FamilieRadioGruppe
                    legend="Skal stønaden reduseres fordi brukeren har fått utbetalt stønad for tilsyn av barn etter tilleggsstønadsforskriften?"
                    feil={valideringsfeil.skalStønadReduseres}
                    erLesevisning={!behandlingErRedigerbar}
                    verdi={radiovalgTilTekst[stønadsreduksjon.value as ERadioValg]}
                >
                    <Radio
                        name={'Redusere'}
                        label={'Ja'}
                        value={ERadioValg.JA}
                        checked={stønadsreduksjon.value === ERadioValg.JA}
                        onChange={(event) => stønadsreduksjon.onChange(event)}
                    />
                    <Radio
                        name={'Redusere'}
                        label={'Nei'}
                        value={ERadioValg.NEI}
                        checked={stønadsreduksjon.value === ERadioValg.NEI}
                        onChange={(event) => stønadsreduksjon.onChange(event)}
                    />
                </FamilieRadioGruppe>
            )}
            {tilleggsstønad.value === ERadioValg.JA && stønadsreduksjon.value === ERadioValg.JA && (
                <>
                    <KolonneHeaderWrapper lesevisning={!behandlingErRedigerbar}>
                        <Element>Periode fra og med</Element>
                        <Element>Periode til og med</Element>
                        <Element>Stønadsreduksjon</Element>
                    </KolonneHeaderWrapper>
                    {tilleggsstønadPerioder.value.map((periode, index) => {
                        const { årMånedFra, årMånedTil, beløp } = periode;
                        const skalViseFjernKnapp =
                            behandlingErRedigerbar &&
                            index === tilleggsstønadPerioder.value.length - 1 &&
                            index !== 0;
                        return (
                            <>
                                <TilleggsstønadPeriodeContainer>
                                    <MånedÅrPeriode
                                        årMånedFraInitiell={årMånedFra}
                                        årMånedTilInitiell={årMånedTil}
                                        index={index}
                                        onEndre={(verdi, periodeVariant) => {
                                            settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                            oppdaterTilleggsstønadPeriode(
                                                index,
                                                periodeVariantTilleggsstønadPeriodeProperty(
                                                    periodeVariant
                                                ),
                                                verdi
                                            );
                                        }}
                                        feilmelding={
                                            valideringsfeil.tilleggsstønadsperioder &&
                                            valideringsfeil.tilleggsstønadsperioder[index]
                                                ?.årMånedFra
                                        }
                                        erLesevisning={!behandlingErRedigerbar}
                                    />
                                    <StyledInput
                                        type="number"
                                        onKeyPress={tilHeltall}
                                        value={harTallverdi(beløp) ? beløp : ''}
                                        onChange={(e) => {
                                            settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                            oppdaterTilleggsstønadPeriode(
                                                index,
                                                ETilleggsstønadPeriodeProperty.beløp,
                                                tilTallverdi(e.target.value)
                                            );
                                        }}
                                        erLesevisning={!behandlingErRedigerbar}
                                    />
                                    {skalViseFjernKnapp && (
                                        <FjernKnapp
                                            onClick={() => {
                                                tilleggsstønadPerioder.remove(index);
                                                settValideringsfeil(
                                                    (prevState: FormErrors<InnvilgeVedtakForm>) => {
                                                        const perioder = (
                                                            prevState.tilleggsstønadsperioder ?? []
                                                        ).filter((_, i) => i !== index);
                                                        return { ...prevState, perioder };
                                                    }
                                                );
                                            }}
                                            knappetekst="Fjern periode"
                                        />
                                    )}
                                </TilleggsstønadPeriodeContainer>
                            </>
                        );
                    })}
                    <LeggTilKnapp
                        onClick={() => tilleggsstønadPerioder.push(tomTilleggsstønadRad)}
                        knappetekst="Legg til periode"
                        hidden={!behandlingErRedigerbar}
                    />
                </>
            )}
            {tilleggsstønad.value === ERadioValg.JA && (
                <EnsligTextArea
                    value={tilleggsstønadBegrunnelse.value}
                    onChange={(event) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        tilleggsstønadBegrunnelse.onChange(event);
                    }}
                    label="Begrunnelse stønadsreduksjon"
                    maxLength={0}
                    erLesevisning={!behandlingErRedigerbar}
                    feilmelding={valideringsfeil.tilleggsstønadBegrunnelse}
                />
            )}
        </>
    );
};

export default TilleggsstønadValg;
