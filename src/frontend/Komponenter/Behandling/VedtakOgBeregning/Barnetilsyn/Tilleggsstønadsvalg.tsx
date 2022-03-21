import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Element } from 'nav-frontend-typografi';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import {
    EStønadsreduksjon,
    ETilleggsstønad,
    ETilleggsstønadPeriodeProperty,
    ITilleggsstønadPeriode,
} from '../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { useApp } from '../../../../App/context/AppContext';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { harTallverdi, tilTallverdi } from '../../../../App/utils/utils';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import { FieldState } from '../../../../App/hooks/felles/useFieldState';
import { EnsligTextArea } from '../../../../Felles/Input/TekstInput/EnsligTextArea';

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
    tilleggsstønadPerioder: ListState<ITilleggsstønadPeriode>;
    periodeValideringsfeil?: FormErrors<InnvilgeVedtakForm>['tilleggsstønadsperioder'];
    settPeriodeValideringsfeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    begrunnelseValideringsfeil: FormErrors<InnvilgeVedtakForm>['tilleggsstønadBegrunnelse'];
}

export const tomTilleggsstønadRad: ITilleggsstønadPeriode = {
    årMånedFra: '',
    årMånedTil: '',
    beløp: undefined,
};

const TilleggsstønadValg: React.FC<Props> = ({
    tilleggsstønad,
    tilleggsstønadBegrunnelse,
    stønadsreduksjon,
    tilleggsstønadPerioder,
    periodeValideringsfeil,
    settPeriodeValideringsfeil,
    begrunnelseValideringsfeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    useEffect(() => {
        if (tilleggsstønad.value === ETilleggsstønad.NEI) {
            stønadsreduksjon.setValue(EStønadsreduksjon.NEI);
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
            <RadioGruppe legend="Er det søkt om, utbetales det eller har det blitt utbetalt stønad for utgifter til tilsyn av barn etter tilleggsstønadsforskriften?">
                <Radio
                    name={'Tilleggsstønad'}
                    label={'Ja'}
                    value={ETilleggsstønad.JA}
                    checked={tilleggsstønad.value === ETilleggsstønad.JA}
                    onChange={(event) => tilleggsstønad.onChange(event)}
                />
                <Radio
                    name={'Tilleggsstønad'}
                    label={'Nei'}
                    value={ETilleggsstønad.NEI}
                    checked={tilleggsstønad.value === ETilleggsstønad.NEI}
                    onChange={(event) => tilleggsstønad.onChange(event)}
                />
            </RadioGruppe>
            {tilleggsstønad.value === ETilleggsstønad.JA && (
                <RadioGruppe legend="Skal stønaden reduseres fordi brukeren har fått utbetalt stønad for tilsyn av barn etter tilleggsstønadsforskriften?">
                    <Radio
                        name={'Redusere'}
                        label={'Ja'}
                        value={EStønadsreduksjon.JA}
                        checked={stønadsreduksjon.value === EStønadsreduksjon.JA}
                        onChange={(event) => stønadsreduksjon.onChange(event)}
                    />
                    <Radio
                        name={'Redusere'}
                        label={'Nei'}
                        value={EStønadsreduksjon.NEI}
                        checked={stønadsreduksjon.value === EStønadsreduksjon.NEI}
                        onChange={(event) => stønadsreduksjon.onChange(event)}
                    />
                </RadioGruppe>
            )}
            {tilleggsstønad.value === ETilleggsstønad.JA &&
                stønadsreduksjon.value === EStønadsreduksjon.JA && (
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
                                                periodeValideringsfeil &&
                                                periodeValideringsfeil[index]?.årMånedFra
                                            }
                                            erLesevisning={!behandlingErRedigerbar}
                                        />
                                        <StyledInput
                                            type="number"
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
                                                    settPeriodeValideringsfeil(
                                                        (
                                                            prevState: FormErrors<InnvilgeVedtakForm>
                                                        ) => {
                                                            const perioder = (
                                                                prevState.tilleggsstønadsperioder ??
                                                                []
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
            {tilleggsstønad.value === ETilleggsstønad.JA && (
                <EnsligTextArea
                    value={tilleggsstønadBegrunnelse.value}
                    onChange={(event) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        tilleggsstønadBegrunnelse.onChange(event);
                    }}
                    label="Begrunnelse"
                    maxLength={0}
                    erLesevisning={!behandlingErRedigerbar}
                    feilmelding={begrunnelseValideringsfeil}
                />
            )}
        </>
    );
};

export default TilleggsstønadValg;
