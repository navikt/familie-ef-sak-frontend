import {
    EInntektsperiodeProperty,
    ESamordningsfradragtype,
    IInntektsperiode,
    samordningsfradagTilTekst,
} from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import InputMedTusenSkille from '../../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { harTallverdi, tilTallverdi } from '../../../../../App/utils/utils';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import {
    Alert,
    BodyLong,
    Checkbox,
    CheckboxGroup,
    Heading,
    ReadMore,
    Tooltip,
} from '@navikt/ds-react';
import { v4 as uuidv4 } from 'uuid';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import { EnsligErrorMessage } from '../../../../../Felles/ErrorMessage/EnsligErrorMessage';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { TextLabel } from '../../../../../Felles/Visningskomponenter/Tekster';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import { initierValgteInntektstyper } from './utils';
import { AlertError, AlertWarning } from '../../../../../Felles/Visningskomponenter/Alerts';
import { EInntektstype, inntektsTypeTilKey, inntektsTypeTilTekst } from './typer';
import { ABorderDivider, AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { IngenBegrunnelseOppgitt } from './IngenBegrunnelseOppgitt';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const AdvarselVisning = styled(AlertWarning)`
    max-width: 50rem;
`;

const Grid = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.lesevisning ? 'repeat(4, max-content)' : ' repeat(8, max-content)'};
    grid-gap: 0.5rem 1rem;
    align-items: start;

    .ny-rad {
        grid-column: 1;
    }
    .ny-rad-full-bredde {
        grid-column: 1;
        grid-column-end: none;
    }
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    max-width: 55rem;
`;

export const tomInntektsperiodeRad = (årMånedFra?: string): IInntektsperiode => ({
    årMånedFra: årMånedFra || '',
    endretKey: uuidv4(),
});

const LeggTilRadKnapp = styled(LeggTilKnapp)`
    margin-top: 0.5rem;
`;

const CheckboxGroupRow = styled(CheckboxGroup)`
    .navds-checkboxes {
        display: flex;
        gap: 1.5rem;
        flex-wrap: wrap;
    }
`;

const ReadMoreMedMarginBottom = styled(ReadMore)`
    margin-bottom: 2rem;
`;

const SamordningsfradragTypeContainer = styled.div`
    margin: 1.5rem 0;
    border-top: 1px solid ${ABorderDivider};
    width: 100%;
`;

const EnsligFamilieSelectBegrensetWidth = styled(EnsligFamilieSelect)`
    width: max-content;
    margin-top: 1rem;
`;

interface Props {
    className?: string;
    errorState?: FormErrors<InnvilgeVedtakForm>;
    inntektBegrunnelseState: FieldState;
    inntektsperiodeListe: ListState<IInntektsperiode>;
    samordningsfradragstype: FieldState;
    setValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    skalVelgeSamordningstype: boolean;
}

const lagFeilmeldingCheckbox = (type: string) =>
    `En eller flere inntektsperioder på "${type}" ligger inne med et beløp. Skal feltet avhukes må beløp fjernes først.`;

const InntektsperiodeValg: React.FC<Props> = ({
    className,
    errorState,
    inntektBegrunnelseState,
    inntektsperiodeListe,
    samordningsfradragstype,
    setValideringsFeil,
    skalVelgeSamordningstype,
}) => {
    const { behandlingErRedigerbar, åpenHøyremeny } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const skalViseLeggTilKnapp = behandlingErRedigerbar;
    const [feilmeldingCheckbox, settFeilmeldingCheckbox] = useState<string>();

    const [valgteInntektstyper, settValgteInntektstyper] = useState<EInntektstype[]>(
        initierValgteInntektstyper(inntektsperiodeListe.value)
    );

    useEffect(() => {
        settValgteInntektstyper(initierValgteInntektstyper(inntektsperiodeListe.value));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inntektsperiodeListe.value[0].endretKey]);

    const oppdaterInntektslisteVerdier = (index: number, verdier: Partial<IInntektsperiode>) => {
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);

        inntektsperiodeListe.update({ ...inntektsperiodeListe.value[index], ...verdier }, index);
    };

    const leggTilTomRadUnder = (index: number) => {
        inntektsperiodeListe.setValue((prevState) => [
            ...prevState.slice(0, index + 1),
            tomInntektsperiodeRad(),
            ...prevState.slice(index + 1, prevState.length),
        ]);
    };

    const harFjernetInntektstypeMedVerdi = (
        nyeInntektstyper: EInntektstype[],
        type: EInntektstype,
        key: keyof IInntektsperiode
    ): boolean => {
        const erCheckboxAvhuket =
            !nyeInntektstyper.includes(type) && valgteInntektstyper.includes(type);
        return erCheckboxAvhuket && inntektsperiodeListe.value.some((periode) => periode[key]);
    };

    const finnFjernetInntektstypeMedVerdi = (
        inntektstyper: EInntektstype[]
    ): EInntektstype | undefined =>
        Object.keys(inntektsTypeTilKey).find((type) =>
            harFjernetInntektstypeMedVerdi(
                inntektstyper,
                type as EInntektstype,
                inntektsTypeTilKey[type as EInntektstype]
            )
        ) as EInntektstype | undefined;

    const oppdaterValgteInntektstyper = (inntektstyper: EInntektstype[]) => {
        const fjernetInntektstypeMedVerdi = finnFjernetInntektstypeMedVerdi(inntektstyper);

        if (fjernetInntektstypeMedVerdi) {
            settFeilmeldingCheckbox(
                lagFeilmeldingCheckbox(inntektsTypeTilTekst[fjernetInntektstypeMedVerdi])
            );
        } else {
            settFeilmeldingCheckbox(undefined);
            settValgteInntektstyper(inntektstyper);
        }
    };

    return (
        <Container>
            <Heading size="small" level="5">
                Inntekt
            </Heading>
            {!behandlingErRedigerbar && inntektBegrunnelseState.value === '' ? (
                <IngenBegrunnelseOppgitt />
            ) : (
                <EnsligTextArea
                    value={inntektBegrunnelseState.value}
                    onChange={(event) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        inntektBegrunnelseState.onChange(event);
                    }}
                    label="Begrunnelse for inntektsfastsettelse"
                    maxLength={0}
                    erLesevisning={!behandlingErRedigerbar}
                    feilmelding={errorState?.inntektBegrunnelse}
                />
            )}
            <HorizontalScroll
                className={className}
                synligVedLukketMeny={'1080px'}
                synligVedÅpenMeny={'1320px'}
                åpenHøyremeny={åpenHøyremeny}
            >
                {behandlingErRedigerbar && (
                    <CheckboxGroupRow
                        legend="Velg inntektsperiodetype"
                        hideLegend
                        onChange={(values) => oppdaterValgteInntektstyper(values)}
                        value={valgteInntektstyper}
                    >
                        <Checkbox value={EInntektstype.DAGSATS}>Dagsats</Checkbox>
                        <Checkbox value={EInntektstype.MÅNEDSINNTEKT}>Månedsinntekt</Checkbox>
                        <Checkbox value={EInntektstype.ÅRSINNTEKT}>Årsinntekt</Checkbox>
                        <Checkbox value={EInntektstype.SAMORDNINGSFRADRAG}>
                            Samordningsfradrag
                        </Checkbox>
                    </CheckboxGroupRow>
                )}
                {feilmeldingCheckbox && <AlertError inline>{feilmeldingCheckbox}</AlertError>}
                <ReadMoreMedMarginBottom header="Slik bruker du inntektsfeltene" size="small">
                    {InntektsforklaringBody}
                </ReadMoreMedMarginBottom>
                {valgteInntektstyper.length ? (
                    <>
                        <Grid lesevisning={!behandlingErRedigerbar}>
                            <TextLabel>Fra</TextLabel>
                            {valgteInntektstyper.includes(EInntektstype.DAGSATS) && (
                                <TextLabel>Dagsats</TextLabel>
                            )}
                            {valgteInntektstyper.includes(EInntektstype.MÅNEDSINNTEKT) && (
                                <TextLabel>Månedsinntekt</TextLabel>
                            )}
                            {valgteInntektstyper.includes(EInntektstype.ÅRSINNTEKT) && (
                                <TextLabel>Årsinntekt</TextLabel>
                            )}
                            {valgteInntektstyper.includes(EInntektstype.SAMORDNINGSFRADRAG) && (
                                <TextLabel>Samordningsfradrag</TextLabel>
                            )}

                            {inntektsperiodeListe.value.map((rad, index) => {
                                const skalViseFjernKnapp =
                                    behandlingErRedigerbar &&
                                    index !== 0 &&
                                    (skalViseLeggTilKnapp ||
                                        index === inntektsperiodeListe.value.length - 1);
                                const årsinntektErAvrundetTilNærmesteHundreOgManglerMånedÅrSats =
                                    rad.harSaksbehandlerManueltTastetHundreBeløp &&
                                    !rad.månedsinntekt &&
                                    !rad.dagsats;
                                return (
                                    <React.Fragment key={rad.endretKey}>
                                        <MånedÅrVelger
                                            className={'ny-rad'}
                                            disabled={index === 0}
                                            feilmelding={
                                                errorState?.inntekter &&
                                                errorState?.inntekter[index]?.årMånedFra
                                            }
                                            aria-label={'Inntekt fra'}
                                            onEndret={(e) => {
                                                oppdaterInntektslisteVerdier(index, {
                                                    [EInntektsperiodeProperty.årMånedFra]: e,
                                                });
                                            }}
                                            årMånedInitiell={rad.årMånedFra}
                                            antallÅrTilbake={10}
                                            antallÅrFrem={4}
                                            lesevisning={!behandlingErRedigerbar}
                                        />
                                        {valgteInntektstyper.includes(EInntektstype.DAGSATS) && (
                                            <StyledInput
                                                label={'Dagsats'}
                                                hideLabel
                                                error={
                                                    errorState?.inntekter &&
                                                    errorState?.inntekter[index]?.dagsats
                                                }
                                                erLesevisning={!behandlingErRedigerbar}
                                                value={harTallverdi(rad.dagsats) ? rad.dagsats : ''}
                                                onChange={(e) => {
                                                    oppdaterInntektslisteVerdier(index, {
                                                        [EInntektsperiodeProperty.dagsats]:
                                                            tilTallverdi(e.target.value),
                                                    });
                                                }}
                                            />
                                        )}
                                        {valgteInntektstyper.includes(
                                            EInntektstype.MÅNEDSINNTEKT
                                        ) && (
                                            <StyledInput
                                                label={'Månedsinntekt'}
                                                hideLabel
                                                erLesevisning={!behandlingErRedigerbar}
                                                error={
                                                    errorState?.inntekter &&
                                                    errorState?.inntekter[index]?.månedsinntekt
                                                }
                                                value={
                                                    harTallverdi(rad.månedsinntekt)
                                                        ? rad.månedsinntekt
                                                        : ''
                                                }
                                                onChange={(e) => {
                                                    oppdaterInntektslisteVerdier(index, {
                                                        [EInntektsperiodeProperty.månedsinntekt]:
                                                            tilTallverdi(e.target.value),
                                                    });
                                                }}
                                            />
                                        )}
                                        {valgteInntektstyper.includes(EInntektstype.ÅRSINNTEKT) && (
                                            <StyledInput
                                                label={'Årsinntekt'}
                                                hideLabel
                                                type="number"
                                                error={
                                                    errorState?.inntekter &&
                                                    errorState?.inntekter[index]?.forventetInntekt
                                                }
                                                value={
                                                    harTallverdi(rad.forventetInntekt)
                                                        ? rad.forventetInntekt
                                                        : ''
                                                }
                                                onChange={(e) => {
                                                    const verdi = tilTallverdi(e.target.value);
                                                    const saksbehandlerHarAvrundetÅrsinntektTilNærmesteHundre =
                                                        verdi !== undefined &&
                                                        typeof verdi === 'number' &&
                                                        verdi % 100 === 0 &&
                                                        verdi % 1000 !== 0;

                                                    oppdaterInntektslisteVerdier(index, {
                                                        [EInntektsperiodeProperty.harSaksbehandlerManueltTastetHundreBeløp]:
                                                            saksbehandlerHarAvrundetÅrsinntektTilNærmesteHundre,
                                                        [EInntektsperiodeProperty.forventetInntekt]:
                                                            verdi,
                                                    });
                                                }}
                                                erLesevisning={!behandlingErRedigerbar}
                                            />
                                        )}
                                        {valgteInntektstyper.includes(
                                            EInntektstype.SAMORDNINGSFRADRAG
                                        ) && (
                                            <>
                                                <StyledInput
                                                    label={'Samordningsfradrag (mnd)'}
                                                    hideLabel
                                                    type="number"
                                                    error={
                                                        errorState?.inntekter &&
                                                        errorState?.inntekter[index]
                                                            ?.samordningsfradrag
                                                    }
                                                    value={
                                                        harTallverdi(rad.samordningsfradrag)
                                                            ? rad.samordningsfradrag
                                                            : ''
                                                    }
                                                    onChange={(e) => {
                                                        oppdaterInntektslisteVerdier(index, {
                                                            [EInntektsperiodeProperty.samordningsfradrag]:
                                                                tilTallverdi(e.target.value),
                                                        });
                                                    }}
                                                    erLesevisning={!behandlingErRedigerbar}
                                                />
                                            </>
                                        )}
                                        {skalViseLeggTilKnapp && (
                                            <Tooltip content="Legg til rad under" placement="right">
                                                <LeggTilKnapp
                                                    onClick={() => {
                                                        leggTilTomRadUnder(index);
                                                    }}
                                                    ikontekst={'Legg til ny rad'}
                                                    variant="tertiary"
                                                />
                                            </Tooltip>
                                        )}
                                        {skalViseFjernKnapp ? (
                                            <FjernKnapp
                                                onClick={() => {
                                                    inntektsperiodeListe.remove(index);
                                                    setValideringsFeil(
                                                        (
                                                            prevState: FormErrors<InnvilgeVedtakForm>
                                                        ) => {
                                                            const inntekter = (
                                                                prevState.inntekter ?? []
                                                            ).filter((_, i) => i !== index);
                                                            return { ...prevState, inntekter };
                                                        }
                                                    );
                                                }}
                                                ikontekst={'Fjern inntektsperiode'}
                                            />
                                        ) : (
                                            <div />
                                        )}
                                        {årsinntektErAvrundetTilNærmesteHundreOgManglerMånedÅrSats && (
                                            <AdvarselVisning className={'ny-rad-full-bredde'}>
                                                Årsinntekt som slutter på hundre kroner blir ikke
                                                avrundet ned til nærmeste tusen kroner. Hvis
                                                årsinntekten skal avrundes ned til nærmeste tusen
                                                kroner, så må du legge inn avrundet årsinntekt
                                                manuelt.
                                            </AdvarselVisning>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </Grid>
                        {skalVelgeSamordningstype && (
                            <SamordningsfradragTypeContainer>
                                <EnsligFamilieSelectBegrensetWidth
                                    label={'Type samordningsfradrag'}
                                    size={'medium'}
                                    value={
                                        skalVelgeSamordningstype
                                            ? samordningsfradragstype.value
                                            : ''
                                    }
                                    onChange={(event) => {
                                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                        samordningsfradragstype.onChange(event);
                                    }}
                                    disabled={!skalVelgeSamordningstype}
                                    erLesevisning={!behandlingErRedigerbar}
                                    lesevisningVerdi={
                                        samordningsfradragstype.value &&
                                        samordningsfradagTilTekst[
                                            samordningsfradragstype.value as ESamordningsfradragtype
                                        ]
                                    }
                                >
                                    <option value="">Velg</option>
                                    <option value={ESamordningsfradragtype.GJENLEVENDEPENSJON}>
                                        Gjenlevendepensjon
                                    </option>
                                    <option value={ESamordningsfradragtype.UFØRETRYGD}>
                                        Uføretrygd
                                    </option>
                                </EnsligFamilieSelectBegrensetWidth>
                                <EnsligErrorMessage>
                                    {errorState?.samordningsfradragType}
                                </EnsligErrorMessage>
                            </SamordningsfradragTypeContainer>
                        )}
                        {behandlingErRedigerbar && (
                            <LeggTilRadKnapp
                                onClick={() => inntektsperiodeListe.push(tomInntektsperiodeRad())}
                                knappetekst=" Legg til inntektsperiode"
                            />
                        )}
                    </>
                ) : (
                    <Alert variant="info">Ingen inntektsperioder valgt</Alert>
                )}
            </HorizontalScroll>
        </Container>
    );
};

const InntektsforklaringBody = (
    <FlexColumn>
        <BodyLong size="small">
            <strong>Dagsats:</strong> Hvis bruker kun får stønad med dagsats fra NAV, legges
            dagsatsen inn i denne kolonnen. EF Sak vil automatisk regne om dagsatsen til årsinntekt
            ved å gange dagsatsen med 260 (virkedager per år).
        </BodyLong>
        <BodyLong size="small">
            <strong>Månedsinntekt:</strong> Hvis bruker har inntekt som blir innrapportert per
            måned, legges månedsinntekten inn i denne kolonnen. EF Sak vil automatisk regne om
            månedsinntekten til årsinntekt ved å gange månedsinntekten med 12.
        </BodyLong>
        <BodyLong size="small">
            <strong>Årsinntekt:</strong> Hvis bruker er selvstendig næringsdrivende eller vi av
            andre grunner ikke har månedsinntekt, legges årsinntekten inn i denne kolonnen.
        </BodyLong>
        <BodyLong size="small">
            <strong>Samordningsfradrag:</strong> Hvis bruker får uføretrygd eller gjenlevendepensjon
            som skal samordnes krone for krone med overgangsstønaden, legges månedsbeløpet (uten
            barnetillegg) inn i denne kolonnen.
        </BodyLong>
        <BodyLong size="small">
            <strong>Merk:</strong> Det er <strong>faktisk inntekt</strong> som skal legges inn i
            feltene. EF Sak vil automatisk runde total inntekt ned til nærmeste tusen kroner.
        </BodyLong>
    </FlexColumn>
);

export default InntektsperiodeValg;
