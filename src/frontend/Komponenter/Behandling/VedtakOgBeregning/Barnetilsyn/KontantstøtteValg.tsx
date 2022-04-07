import React, { Dispatch, SetStateAction } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Element } from 'nav-frontend-typografi';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import {
    EKontantstøttePeriodeProperty,
    ERadioValg,
    IPeriodeMedBeløp,
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

const KontantstøttePeriodeContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger tilOgMedVelger kontantstøtte slettKnapp';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 10rem 7rem 7rem 7rem' : '12rem 12rem 6rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: 0.75rem;
`;

const KolonneHeaderWrapper = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger tilOgMedVelger kontantstøtte';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 10rem 7rem' : '12rem 12rem 6rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: 0.5rem;
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;

interface Props {
    kontantstøtte: FieldState;
    kontantstøttePerioder: ListState<IPeriodeMedBeløp>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>;
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

export const tomKontantstøtteRad: IPeriodeMedBeløp = {
    årMånedFra: '',
    årMånedTil: '',
    beløp: undefined,
};

const KontantstøtteValg: React.FC<Props> = ({
    kontantstøtte,
    kontantstøttePerioder,
    valideringsfeil,
    settValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    const oppdaterKontantstøttePeriode = (
        index: number,
        property: EKontantstøttePeriodeProperty,
        value: string | string[] | number | undefined
    ) => {
        kontantstøttePerioder.update(
            {
                ...kontantstøttePerioder.value[index],
                [property]: value,
            },
            index
        );
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
    };

    const periodeVariantTilKontantstøtteperiodeProperty = (
        periodeVariant: PeriodeVariant
    ): EKontantstøttePeriodeProperty => {
        switch (periodeVariant) {
            case PeriodeVariant.ÅR_MÅNED_FRA:
                return EKontantstøttePeriodeProperty.årMånedFra;
            case PeriodeVariant.ÅR_MÅNED_TIL:
                return EKontantstøttePeriodeProperty.årMånedTil;
        }
    };

    return (
        <>
            <RadioGruppe
                legend="Er det søkt om, utbetales det eller har det blitt utbetalt kontantstøtte til brukeren eller en brukeren bor med?"
                feil={valideringsfeil?.harKontantstøtte}
            >
                <Radio
                    name={'Kontantstøtte'}
                    label={'Ja'}
                    value={ERadioValg.JA}
                    checked={kontantstøtte.value === ERadioValg.JA}
                    onChange={(event) => kontantstøtte.onChange(event)}
                />
                <Radio
                    name={'Kontantstøtte'}
                    label={'Nei'}
                    value={ERadioValg.NEI}
                    checked={kontantstøtte.value === ERadioValg.NEI}
                    onChange={(event) => kontantstøtte.onChange(event)}
                />
            </RadioGruppe>
            {kontantstøtte.value === ERadioValg.JA && (
                <>
                    <KolonneHeaderWrapper lesevisning={!behandlingErRedigerbar}>
                        <Element>Periode fra og med</Element>
                        <Element>Periode til og med</Element>
                        <Element>Kontantstøtte</Element>
                    </KolonneHeaderWrapper>
                    {kontantstøttePerioder.value.map((periode, index) => {
                        const { årMånedFra, årMånedTil, beløp } = periode;
                        const skalViseFjernKnapp =
                            behandlingErRedigerbar &&
                            index === kontantstøttePerioder.value.length - 1 &&
                            index !== 0;
                        return (
                            <React.Fragment key={index}>
                                <KontantstøttePeriodeContainer>
                                    <MånedÅrPeriode
                                        årMånedFraInitiell={årMånedFra}
                                        årMånedTilInitiell={årMånedTil}
                                        index={index}
                                        onEndre={(verdi, periodeVariant) => {
                                            settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                            oppdaterKontantstøttePeriode(
                                                index,
                                                periodeVariantTilKontantstøtteperiodeProperty(
                                                    periodeVariant
                                                ),
                                                verdi
                                            );
                                        }}
                                        feilmelding={
                                            valideringsfeil?.kontantstøtteperioder &&
                                            valideringsfeil.kontantstøtteperioder[index]?.årMånedFra
                                        }
                                        erLesevisning={!behandlingErRedigerbar}
                                    />
                                    <StyledInput
                                        type="number"
                                        value={harTallverdi(beløp) ? beløp : ''}
                                        onChange={(e) => {
                                            settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                            oppdaterKontantstøttePeriode(
                                                index,
                                                EKontantstøttePeriodeProperty.beløp,
                                                tilTallverdi(e.target.value)
                                            );
                                        }}
                                        erLesevisning={!behandlingErRedigerbar}
                                    />
                                    {skalViseFjernKnapp && (
                                        <FjernKnapp
                                            onClick={() => {
                                                kontantstøttePerioder.remove(index);
                                                settValideringsFeil(
                                                    (prevState: FormErrors<InnvilgeVedtakForm>) => {
                                                        const perioder = (
                                                            prevState.kontantstøtteperioder ?? []
                                                        ).filter((_, i) => i !== index);
                                                        return { ...prevState, perioder };
                                                    }
                                                );
                                            }}
                                            knappetekst="Fjern kontantstøtteperiode"
                                        />
                                    )}
                                </KontantstøttePeriodeContainer>
                            </React.Fragment>
                        );
                    })}
                    <LeggTilKnapp
                        onClick={() => kontantstøttePerioder.push(tomKontantstøtteRad)}
                        knappetekst="Legg til periode"
                        hidden={!behandlingErRedigerbar}
                    />
                </>
            )}
        </>
    );
};

export default KontantstøtteValg;
