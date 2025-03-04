import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import {
    EKontantstøttePeriodeProperty,
    ERadioValg,
    IPeriodeMedBeløp,
} from '../../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { useApp } from '../../../../../App/context/AppContext';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeBarnetilsyn';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../../App/utils/utils';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { Heading, Label, Tooltip } from '@navikt/ds-react';
import InputMedTusenSkille from '../../../../../Felles/Visningskomponenter/InputMedTusenskille';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { v4 as uuidv4 } from 'uuid';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { KontantstøtteAlert } from './KontantstøtteAlert';
import JaNeiRadioGruppe from '../../Felles/JaNeiRadioGruppe';
import { KontantstøttePeriode } from '../../../Inngangsvilkår/vilkår';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

const AlertOgRadioknappWrapper = styled.div`
    width: fit-content;
`;

const Grid = styled.div<{ $lesevisning: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.$lesevisning
            ? 'repeat(3, max-content)'
            : 'repeat(2, max-content) 6rem repeat(2, max-content)'};
    grid-gap: 0.5rem 1rem;
    margin-bottom: 0.5rem;
    align-items: start;

    .ny-rad {
        grid-column: 1;
    }
`;

const Input = styled(InputMedTusenSkille)`
    text-align: right;
`;

const TextArea = styled(EnsligTextArea)`
    margin-top: 1rem;
`;

interface Props {
    erLesevisning: boolean;
    kontantstøtte: FieldState;
    kontantstøttePerioder: ListState<IPeriodeMedBeløp>;
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    valideringsfeil: FormErrors<InnvilgeVedtakForm>;
    harKontantstøttePerioder?: boolean;
    kontantstøtteBegrunnelse: FieldState;
    kontantstøttePerioderFraGrunnlagsdata: KontantstøttePeriode[];
    registeropplysningerOpprettetTid: string;
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
    harKontantstøttePerioder,
    kontantstøtteBegrunnelse,
    kontantstøttePerioderFraGrunnlagsdata,
    registeropplysningerOpprettetTid,
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
    const visGrid = kontantstøttePerioder.value.length > 0;
    const radioGruppeTekst =
        'Skal stønaden reduseres fordi brukeren, eller en brukeren bor med, har fått utbetalt kontantstøtte i perioden(e) det er søkt om?';
    const skalViseBegrunnelseLesevisning = erLesevisning && kontantstøtteBegrunnelse.value !== null;

    return (
        <Container>
            <Heading spacing size="small" level="5">
                Kontantstøtte
            </Heading>
            <AlertOgRadioknappWrapper>
                <KontantstøtteAlert
                    harKontantstøttePerioder={harKontantstøttePerioder}
                    kontantstøttePerioderFraGrunnlagsdata={kontantstøttePerioderFraGrunnlagsdata}
                    registeropplysningerOpprettetTid={registeropplysningerOpprettetTid}
                />

                <JaNeiRadioGruppe
                    error={valideringsfeil?.harKontantstøtte}
                    legend={radioGruppeTekst}
                    lesevisning={erLesevisning}
                    onChange={(event) => kontantstøtte.onChange(event)}
                    value={kontantstøtte.value as ERadioValg}
                />
            </AlertOgRadioknappWrapper>
            {kontantstøtte.value === ERadioValg.JA && (
                <HorizontalScroll
                    $synligVedLukketMeny={'795px'}
                    $synligVedÅpenMeny={'1115'}
                    $åpenHøyremeny={åpenHøyremeny}
                >
                    {visGrid && (
                        <Grid $lesevisning={erLesevisning}>
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
                                            error={
                                                valideringsfeil?.kontantstøtteperioder &&
                                                valideringsfeil?.kontantstøtteperioder[index]?.beløp
                                            }
                                            value={harTallverdi(beløp) ? beløp : ''}
                                            onChange={(e) => {
                                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                                oppdaterKontantstøttePeriode(
                                                    index,
                                                    EKontantstøttePeriodeProperty.beløp,
                                                    tilTallverdi(e.target.value)
                                                );
                                            }}
                                            readOnly={erLesevisning}
                                            label={'Utgifter kontantstøtte'}
                                            hideLabel
                                        />
                                        {!erLesevisning && (
                                            <Tooltip content="Legg til rad under" placement="right">
                                                <LeggTilKnapp
                                                    onClick={() => leggTilTomRadUnder(index)}
                                                    ikontekst={'Legg til ny rad'}
                                                    variant="tertiary"
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
            {(skalViseBegrunnelseLesevisning || !erLesevisning) && (
                <TextArea
                    readOnly={erLesevisning}
                    feilmelding={valideringsfeil.kontantstøtteBegrunnelse}
                    label="Begrunnelse (hvis aktuelt)"
                    maxLength={0}
                    onChange={(event) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        kontantstøtteBegrunnelse?.onChange(event);
                    }}
                    value={kontantstøtteBegrunnelse?.value}
                />
            )}
        </Container>
    );
};

export default KontantstøtteValg;
