import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
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
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../App/utils/utils';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import { FieldState } from '../../../../App/hooks/felles/useFieldState';
import { Heading, Label, Tooltip } from '@navikt/ds-react';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import { v4 as uuidv4 } from 'uuid';
import JaNeiRadioGruppe from '../Felles/JaNeiRadioGruppe';
import { HorizontalScroll } from '../Felles/HorizontalScroll';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

const Grid = styled.div<{ lesevisning: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.lesevisning
            ? 'repeat(3, max-content)'
            : 'repeat(2, max-content) 6rem repeat(2, max-content)'};
    grid-gap: 0.5rem 1rem;
    margin-bottom: 0.5rem;

    .ny-rad {
        grid-column: 1;
    }
`;

const Input = styled(InputMedTusenSkille)`
    text-align: right;
`;

interface Props {
    erLesevisning: boolean;
    kontantstøtte: FieldState;
    kontantstøttePerioder: ListState<IPeriodeMedBeløp>;
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>;
}

export const tomKontantstøtteRad = (): IPeriodeMedBeløp => ({
    årMånedFra: '',
    årMånedTil: '',
    beløp: undefined,
    endretKey: uuidv4(),
});

const KontantstøtteValg: React.FC<Props> = ({
    erLesevisning,
    kontantstøtte,
    kontantstøttePerioder,
    settValideringsFeil,
    valideringsfeil,
}) => {
    const { settIkkePersistertKomponent } = useApp();
    const { åpenHøyremeny } = useBehandling();

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

    const leggTilTomRadUnder = (index: number) => {
        kontantstøttePerioder.setValue((prevState) => [
            ...prevState.slice(0, index + 1),
            tomKontantstøtteRad(),
            ...prevState.slice(index + 1, prevState.length),
        ]);
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

    const radioGruppeTekst =
        'Er det søkt om, utbetales det eller har det blitt utbetalt kontantstøtte til brukeren eller en brukeren bor med i perioden(e) det er søkt om?';
    const visGrid = kontantstøttePerioder.value.length > 0;

    return (
        <Container>
            <Heading spacing size="small" level="5">
                Kontantstøtte
            </Heading>
            <JaNeiRadioGruppe
                error={valideringsfeil?.harKontantstøtte}
                legend={radioGruppeTekst}
                lesevisning={erLesevisning}
                onChange={(event) => kontantstøtte.onChange(event)}
                value={kontantstøtte.value as ERadioValg}
            />
            {kontantstøtte.value === ERadioValg.JA && (
                <HorizontalScroll
                    synligVedLukketMeny={'780px'}
                    synligVedÅpenMeny={'1075px'}
                    åpenHøyremeny={åpenHøyremeny}
                >
                    {visGrid && (
                        <Grid lesevisning={erLesevisning}>
                            <Label>Periode fra og med</Label>
                            <Label>Periode til og med</Label>
                            <Label>Kontantstøtte</Label>
                            {kontantstøttePerioder.value.map((periode, index) => {
                                const { årMånedFra, årMånedTil, beløp } = periode;
                                const skalViseFjernKnapp = !erLesevisning && index !== 0;
                                return (
                                    <React.Fragment key={periode.endretKey}>
                                        <MånedÅrPeriode
                                            className={'ny-rad'}
                                            erLesevisning={erLesevisning}
                                            feilmelding={
                                                valideringsfeil?.kontantstøtteperioder &&
                                                valideringsfeil.kontantstøtteperioder[index]
                                                    ?.årMånedFra
                                            }
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
                                            årMånedFraInitiell={årMånedFra}
                                            årMånedTilInitiell={årMånedTil}
                                        />
                                        <Input
                                            type="number"
                                            size={'small'}
                                            onKeyPress={tilHeltall}
                                            value={harTallverdi(beløp) ? beløp : ''}
                                            onChange={(e) => {
                                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                                oppdaterKontantstøttePeriode(
                                                    index,
                                                    EKontantstøttePeriodeProperty.beløp,
                                                    tilTallverdi(e.target.value)
                                                );
                                            }}
                                            erLesevisning={erLesevisning}
                                            label={'Utgifter kontantstøtte'}
                                            hideLabel
                                        />
                                        {!erLesevisning && (
                                            <Tooltip content="Legg til rad under" placement="right">
                                                <LeggTilKnapp
                                                    onClick={() => leggTilTomRadUnder(index)}
                                                    ikontekst={'Legg til ny rad'}
                                                />
                                            </Tooltip>
                                        )}
                                        {skalViseFjernKnapp ? (
                                            <FjernKnapp
                                                onClick={() => {
                                                    kontantstøttePerioder.remove(index);
                                                    settValideringsFeil(
                                                        (
                                                            prevState: FormErrors<InnvilgeVedtakForm>
                                                        ) => {
                                                            const kontantstøtteperioder = (
                                                                prevState.kontantstøtteperioder ??
                                                                []
                                                            ).filter((_, i) => i !== index);
                                                            return {
                                                                ...prevState,
                                                                kontantstøtteperioder,
                                                            };
                                                        }
                                                    );
                                                }}
                                                ikontekst={'Fjern kontantstøtteperiode'}
                                            />
                                        ) : (
                                            <div />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </Grid>
                    )}
                    {!erLesevisning && (
                        <LeggTilKnapp
                            onClick={() => kontantstøttePerioder.push(tomKontantstøtteRad())}
                            knappetekst="Legg til periode"
                        />
                    )}
                </HorizontalScroll>
            )}
        </Container>
    );
};

export default KontantstøtteValg;
