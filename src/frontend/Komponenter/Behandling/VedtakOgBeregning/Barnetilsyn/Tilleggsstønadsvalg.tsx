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

const InnholdRad = styled.div<{ lesevisning: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8.5rem 8rem 8rem 7rem 7rem' : '13rem 13rem 8rem 4rem 3rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: 0.5rem;
`;

const TittelRad = styled(InnholdRad)`
    margin-top: 1rem;
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: right;
`;
const ContainerMedLuftUnder = styled.div`
    margin-bottom: 1rem;
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
                <>
                    <TittelRad lesevisning={erLesevisning}>
                        <SmallTextLabel>Periode fra og med</SmallTextLabel>
                        <SmallTextLabel>Periode til og med</SmallTextLabel>
                        <SmallTextLabel>Stønadsreduksjon</SmallTextLabel>
                    </TittelRad>
                    {tilleggsstønadPerioder.value.map((periode, index) => {
                        const { årMånedFra, årMånedTil, beløp } = periode;
                        const skalViseFjernKnapp = !erLesevisning && index !== 0;
                        return (
                            <React.Fragment key={periode.endretKey}>
                                <InnholdRad lesevisning={erLesevisning}>
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
                                        erLesevisning={erLesevisning}
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
                                        erLesevisning={erLesevisning}
                                        label={'Stønadsreduksjon'}
                                        hideLabel
                                    />
                                    {skalViseFjernKnapp ? (
                                        <FjernKnapp
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
                                            ikontekst={'Fjern periode for tilleggsstønad'}
                                        />
                                    ) : (
                                        <div />
                                    )}
                                    {!erLesevisning && (
                                        <Tooltip content="Legg til rad under" placement="right">
                                            <LeggTilKnapp
                                                onClick={() => leggTilTomRadUnder(index)}
                                                ikontekst={'Legg til ny rad'}
                                            />
                                        </Tooltip>
                                    )}
                                </InnholdRad>
                            </React.Fragment>
                        );
                    })}
                    <ContainerMedLuftUnder>
                        {!erLesevisning && (
                            <LeggTilKnapp
                                onClick={() => tilleggsstønadPerioder.push(tomTilleggsstønadRad())}
                                knappetekst="Legg til periode"
                            />
                        )}
                    </ContainerMedLuftUnder>
                </>
            )}
            {søktTilleggsstønad && (
                <EnsligTextArea
                    value={tilleggsstønadBegrunnelse.value}
                    onChange={(event) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        tilleggsstønadBegrunnelse.onChange(event);
                    }}
                    label="Begrunnelse"
                    maxLength={0}
                    erLesevisning={erLesevisning}
                    feilmelding={valideringsfeil.tilleggsstønadBegrunnelse}
                />
            )}
        </>
    );
};

export default TilleggsstønadValg;
