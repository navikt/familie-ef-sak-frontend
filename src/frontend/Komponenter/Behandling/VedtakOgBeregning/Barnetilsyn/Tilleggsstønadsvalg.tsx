import React, { Dispatch, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { Element } from 'nav-frontend-typografi';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import {
    ERadioValg,
    ETilleggsstønadPeriodeProperty,
    IPeriodeMedBeløp,
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
import { Radio } from '@navikt/ds-react';
import { EnsligRadioGruppe } from '../../../../Felles/Input/EnsligRadioGruppe';

const TilleggsstønadPeriodeContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger tilOgMedVelger kontantstøtte slettKnapp';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 10rem 7rem 7rem 7rem' : '13rem 13rem 8rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: 0.5rem;
`;

const KolonneHeaderWrapper = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger tilOgMedVelger kontantstøtte';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 10rem 7rem' : '13rem 13rem 8rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: 0.5rem;
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;
const ContainerMedLuftUnder = styled.div`
    margin-bottom: 1rem;
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
            <EnsligRadioGruppe
                legend="Er det søkt om, utbetales det eller har det blitt utbetalt stønad for utgifter til tilsyn av barn etter tilleggsstønadsforskriften i perioden(e) det er søkt om?"
                error={valideringsfeil.harTilleggsstønad}
                erLesevisning={!behandlingErRedigerbar}
                value={tilleggsstønad.value as ERadioValg}
            >
                <Radio
                    name={'Tilleggsstønad'}
                    value={ERadioValg.JA}
                    onChange={(event) => tilleggsstønad.onChange(event)}
                >
                    Ja
                </Radio>
                <Radio
                    name={'Tilleggsstønad'}
                    value={ERadioValg.NEI}
                    onChange={(event) => tilleggsstønad.onChange(event)}
                >
                    Nei
                </Radio>
            </EnsligRadioGruppe>
            {tilleggsstønad.value === ERadioValg.JA && (
                <EnsligRadioGruppe
                    legend="Skal stønaden reduseres fordi brukeren har fått utbetalt stønad for tilsyn av barn etter tilleggsstønadsforskriften?"
                    error={valideringsfeil.skalStønadReduseres}
                    erLesevisning={!behandlingErRedigerbar}
                    value={stønadsreduksjon.value as ERadioValg}
                >
                    <Radio
                        name={'Redusere'}
                        value={ERadioValg.JA}
                        onChange={(event) => stønadsreduksjon.onChange(event)}
                    >
                        Ja
                    </Radio>
                    <Radio
                        name={'Redusere'}
                        value={ERadioValg.NEI}
                        onChange={(event) => stønadsreduksjon.onChange(event)}
                    >
                        Nei
                    </Radio>
                </EnsligRadioGruppe>
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
                            <React.Fragment key={`${årMånedFra}${årMånedTil}${index}`}>
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
                                        size={'small'}
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
                                        label={'Stønadsreduksjon'}
                                        hideLabel
                                    />
                                    {skalViseFjernKnapp && (
                                        <div>
                                            <FjernKnapp
                                                onClick={() => {
                                                    tilleggsstønadPerioder.remove(index);
                                                    settValideringsfeil(
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
                                        </div>
                                    )}
                                </TilleggsstønadPeriodeContainer>
                            </React.Fragment>
                        );
                    })}
                    <ContainerMedLuftUnder>
                        {behandlingErRedigerbar && (
                            <LeggTilKnapp
                                onClick={() => tilleggsstønadPerioder.push(tomTilleggsstønadRad)}
                                knappetekst="Legg til periode"
                            />
                        )}
                    </ContainerMedLuftUnder>
                </>
            )}
            {tilleggsstønad.value === ERadioValg.JA && (
                <EnsligTextArea
                    value={tilleggsstønadBegrunnelse.value}
                    onChange={(event) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        tilleggsstønadBegrunnelse.onChange(event);
                    }}
                    label="Begrunnelse"
                    maxLength={0}
                    erLesevisning={!behandlingErRedigerbar}
                    feilmelding={valideringsfeil.tilleggsstønadBegrunnelse}
                />
            )}
        </>
    );
};

export default TilleggsstønadValg;
