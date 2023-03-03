import React, { Dispatch, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';
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
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../App/utils/utils';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import { FieldState } from '../../../../App/hooks/felles/useFieldState';
import { EnsligTextArea } from '../../../../Felles/Input/TekstInput/EnsligTextArea';
import { Heading, Tooltip } from '@navikt/ds-react';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import { SmallTextLabel } from '../../../../Felles/Visningskomponenter/Tekster';
import { v4 as uuidv4 } from 'uuid';
import JaNeiRadioGruppe from '../Felles/JaNeiRadioGruppe';
import { HorizontalScroll } from '../Felles/HorizontalScroll';
import { useBehandling } from '../../../../App/context/BehandlingContext';

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

const StyledInput = styled(InputMedTusenSkille)`
    text-align: right;
`;

const RadioGruppe = styled(JaNeiRadioGruppe)`
    margin-bottom: 1rem;
`;

interface Props {
    erLesevisning: boolean;
    settValideringsfeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    stønadsreduksjon: FieldState;
    tilleggsstønad: FieldState;
    tilleggsstønadBegrunnelse: FieldState;
    tilleggsstønadPerioder: ListState<IPeriodeMedBeløp>;
    valideringsfeil: FormErrors<InnvilgeVedtakForm>;
}

export const tomTilleggsstønadRad = (): IPeriodeMedBeløp => ({
    årMånedFra: '',
    årMånedTil: '',
    beløp: undefined,
    endretKey: uuidv4(),
});

const TilleggsstønadValg: React.FC<Props> = ({
    erLesevisning,
    settValideringsfeil,
    stønadsreduksjon,
    tilleggsstønad,
    tilleggsstønadBegrunnelse,
    tilleggsstønadPerioder,
    valideringsfeil,
}) => {
    const { settIkkePersistertKomponent } = useApp();
    const { åpenHøyremeny } = useBehandling();

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

    const leggTilTomRadUnder = (index: number) => {
        tilleggsstønadPerioder.setValue((prevState) => [
            ...prevState.slice(0, index + 1),
            tomTilleggsstønadRad(),
            ...prevState.slice(index + 1, prevState.length),
        ]);
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

    const søktTilleggsstønad = tilleggsstønad.value === ERadioValg.JA;
    const stønadSkalReduseres = stønadsreduksjon.value === ERadioValg.JA;
    const erDetSøktOmTekst =
        'Er det søkt om, utbetales det eller har det blitt utbetalt stønad for utgifter til tilsyn av barn etter tilleggsstønadsforskriften i perioden(e) det er søkt om?';
    const skalStønadReduseresTekst =
        'Skal stønaden reduseres fordi brukeren har fått utbetalt stønad for tilsyn av barn etter tilleggsstønadsforskriften?';

    return (
        <>
            <Heading spacing size="small" level="5">
                Tilleggsstønadsforskriften
            </Heading>
            <RadioGruppe
                error={valideringsfeil?.harKontantstøtte}
                legend={erDetSøktOmTekst}
                lesevisning={erLesevisning}
                onChange={(event) => tilleggsstønad.onChange(event)}
                value={tilleggsstønad.value as ERadioValg}
            />
            {søktTilleggsstønad && (
                <RadioGruppe
                    error={valideringsfeil?.skalStønadReduseres}
                    legend={skalStønadReduseresTekst}
                    lesevisning={erLesevisning}
                    onChange={(event) => stønadsreduksjon.onChange(event)}
                    value={stønadsreduksjon.value as ERadioValg}
                />
            )}
            {søktTilleggsstønad && stønadSkalReduseres && (
                <HorizontalScroll
                    synligVedÅpenMeny={'1070px'}
                    synligVedLukketMeny={'770px'}
                    åpenHøyremeny={åpenHøyremeny}
                >
                    <Grid lesevisning={erLesevisning}>
                        <SmallTextLabel>Periode fra og med</SmallTextLabel>
                        <SmallTextLabel>Periode til og med</SmallTextLabel>
                        <SmallTextLabel>Stønadsreduksjon</SmallTextLabel>
                        {tilleggsstønadPerioder.value.map((periode, index) => {
                            const { årMånedFra, årMånedTil, beløp } = periode;
                            const skalViseFjernKnapp = !erLesevisning && index !== 0;
                            return (
                                <React.Fragment key={periode.endretKey}>
                                    <MånedÅrPeriode
                                        className={'ny-rad'}
                                        erLesevisning={erLesevisning}
                                        feilmelding={
                                            valideringsfeil.tilleggsstønadsperioder &&
                                            valideringsfeil.tilleggsstønadsperioder[index]
                                                ?.årMånedFra
                                        }
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
                                        årMånedFraInitiell={årMånedFra}
                                        årMånedTilInitiell={årMånedTil}
                                    />
                                    <StyledInput
                                        erLesevisning={erLesevisning}
                                        hideLabel
                                        label={'Stønadsreduksjon'}
                                        onChange={(e) => {
                                            settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                            oppdaterTilleggsstønadPeriode(
                                                index,
                                                ETilleggsstønadPeriodeProperty.beløp,
                                                tilTallverdi(e.target.value)
                                            );
                                        }}
                                        onKeyPress={tilHeltall}
                                        size={'small'}
                                        type="number"
                                        value={harTallverdi(beløp) ? beløp : ''}
                                    />
                                    {!erLesevisning && (
                                        <Tooltip content="Legg til rad under" placement="right">
                                            <LeggTilKnapp
                                                ikontekst={'Legg til ny rad'}
                                                onClick={() => leggTilTomRadUnder(index)}
                                            />
                                        </Tooltip>
                                    )}
                                    {skalViseFjernKnapp ? (
                                        <FjernKnapp
                                            ikontekst={'Fjern periode for tilleggsstønad'}
                                            onClick={() => {
                                                tilleggsstønadPerioder.remove(index);
                                                settValideringsfeil(
                                                    (prevState: FormErrors<InnvilgeVedtakForm>) => {
                                                        const tilleggsstønadsperioder = (
                                                            prevState.tilleggsstønadsperioder ?? []
                                                        ).filter((_, i) => i !== index);
                                                        return {
                                                            ...prevState,
                                                            tilleggsstønadsperioder,
                                                        };
                                                    }
                                                );
                                            }}
                                        />
                                    ) : (
                                        <div />
                                    )}
                                </React.Fragment>
                            );
                        })}
                        {!erLesevisning && (
                            <LeggTilKnapp
                                knappetekst="Legg til periode"
                                onClick={() => tilleggsstønadPerioder.push(tomTilleggsstønadRad())}
                            />
                        )}
                    </Grid>
                </HorizontalScroll>
            )}
            {søktTilleggsstønad && (
                <EnsligTextArea
                    erLesevisning={erLesevisning}
                    feilmelding={valideringsfeil.tilleggsstønadBegrunnelse}
                    label="Begrunnelse"
                    maxLength={0}
                    onChange={(event) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        tilleggsstønadBegrunnelse.onChange(event);
                    }}
                    value={tilleggsstønadBegrunnelse.value}
                />
            )}
        </>
    );
};

export default TilleggsstønadValg;
