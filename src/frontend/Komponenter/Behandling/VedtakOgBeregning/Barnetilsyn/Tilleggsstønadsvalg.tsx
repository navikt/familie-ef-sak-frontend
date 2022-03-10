import React, { Dispatch, SetStateAction, useState } from 'react';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Element } from 'nav-frontend-typografi';
import { VEDTAK_OG_BEREGNING } from '../konstanter';
import {
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

const TilleggsstønadPeriodeContainer = styled.div<{ lesevisning?: boolean }>`
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
    tilleggsstønadPerioder: ListState<ITilleggsstønadPeriode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['tilleggsstønadsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

export const tomTilleggsstønadRad: ITilleggsstønadPeriode = {
    årMånedFra: '',
    årMånedTil: '',
    beløp: undefined,
};

const TilleggsstønadValg: React.FC<Props> = ({
    tilleggsstønadPerioder,
    valideringsfeil,
    settValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const [tilleggsstønad, settTilleggsstønad] = useState(false);
    const [reduserStønad, settReduserStønad] = useState(false);

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
                    value={'Ja'}
                    onChange={() => settTilleggsstønad(!tilleggsstønad)}
                />
                <Radio
                    name={'Tilleggsstønad'}
                    label={'Nei'}
                    value={'Nei'}
                    checked={!tilleggsstønad}
                    onChange={() => settTilleggsstønad(!tilleggsstønad)}
                />
            </RadioGruppe>
            {tilleggsstønad && (
                <RadioGruppe legend="Skal stønadem reduseres fordi brukeren har fått utbetalt stønad for tilsyn av barn etter tilleggsstønadsforskriften?">
                    <Radio
                        name={'Redusere'}
                        label={'Ja'}
                        value={'Ja'}
                        onChange={() => settReduserStønad(!reduserStønad)}
                    />
                    <Radio
                        name={'Redusere'}
                        label={'Nei'}
                        value={'Nei'}
                        checked={!reduserStønad}
                        onChange={() => settReduserStønad(!reduserStønad)}
                    />
                </RadioGruppe>
            )}
            {tilleggsstønad && reduserStønad && (
                <>
                    <KolonneHeaderWrapper lesevisning={!behandlingErRedigerbar}>
                        <Element>Periode fra og med</Element>
                        <Element>Periode til og med</Element>
                        <Element>Stønad skal reduseres med</Element>
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
                                            valideringsfeil && valideringsfeil[index]?.årMånedFra
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
                                                settValideringsFeil(
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
        </>
    );
};

export default TilleggsstønadValg;
