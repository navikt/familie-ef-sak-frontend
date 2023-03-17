import {
    EInntektsperiodeProperty,
    ESamordningsfradragtype,
    IInntektsperiode,
    samordningsfradagTilTekst,
} from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import InputMedTusenSkille from '../../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { harTallverdi, tilTallverdi } from '../../../../../App/utils/utils';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeVedtak';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { Alert, BodyLong, Checkbox, CheckboxGroup, ReadMore, Tooltip } from '@navikt/ds-react';
import { v4 as uuidv4 } from 'uuid';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import { EnsligErrorMessage } from '../../../../../Felles/ErrorMessage/EnsligErrorMessage';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { TextLabel } from '../../../../../Felles/Visningskomponenter/Tekster';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import { initierValgteInntektstyper } from './utils';

const Grid = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.lesevisning ? 'repeat(4, max-content)' : ' repeat(8, max-content)'};
    grid-gap: 0.5rem 1rem;

    .ny-rad {
        grid-column: 1;
    }
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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

export enum EInntektstype {
    DAGSATS = 'DAGSATS',
    MÅNEDSINNTEKT = 'MÅNEDSINNTEKT',
    ÅRSINNTEKT = 'ÅRSINNTEKT',
    SAMORDNINGSFRADRAG = 'SAMORDNINGSFRADRAG',
}

interface Props {
    className?: string;
    inntektsperiodeListe: ListState<IInntektsperiode>;
    samordningsfradragstype: FieldState;
    samordningValideringsfeil?: FormErrors<InnvilgeVedtakForm>['samordningsfradragType'];
    setValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    skalVelgeSamordningstype: boolean;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['inntekter'];
}

const InntektsperiodeValg: React.FC<Props> = ({
    className,
    inntektsperiodeListe,
    samordningsfradragstype,
    samordningValideringsfeil,
    setValideringsFeil,
    skalVelgeSamordningstype,
    valideringsfeil,
}) => {
    const { behandlingErRedigerbar, åpenHøyremeny } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const skalViseLeggTilKnapp = behandlingErRedigerbar;

    const [valgteInntektstyper, settValgteInntektstyper] = useState<Record<EInntektstype, boolean>>(
        initierValgteInntektstyper(inntektsperiodeListe.value)
    );

    const oppdaterInntektslisteElement = (
        index: number,
        property: EInntektsperiodeProperty,
        value: string | number | undefined
    ) => {
        inntektsperiodeListe.update(
            { ...inntektsperiodeListe.value[index], [property]: value },
            index
        );
    };

    const leggTilTomRadUnder = (index: number) => {
        inntektsperiodeListe.setValue((prevState) => [
            ...prevState.slice(0, index + 1),
            tomInntektsperiodeRad(),
            ...prevState.slice(index + 1, prevState.length),
        ]);
    };

    const oppdaterAvhukningsvalg = (inntektstyper: EInntektstype[]) => {
        settValgteInntektstyper({
            DAGSATS: inntektstyper.includes(EInntektstype.DAGSATS),
            MÅNEDSINNTEKT: inntektstyper.includes(EInntektstype.MÅNEDSINNTEKT),
            ÅRSINNTEKT: inntektstyper.includes(EInntektstype.ÅRSINNTEKT),
            SAMORDNINGSFRADRAG: inntektstyper.includes(EInntektstype.SAMORDNINGSFRADRAG),
        });
    };

    return (
        <HorizontalScroll
            className={className}
            synligVedLukketMeny={'1080px'}
            synligVedÅpenMeny={'1320px'}
            åpenHøyremeny={åpenHøyremeny}
        >
            <CheckboxGroupRow
                legend="Velg inntektsperiodetype"
                hideLegend
                onChange={(values) => oppdaterAvhukningsvalg(values)}
                value={Object.entries(valgteInntektstyper)
                    .filter(([, value]) => value)
                    .map(([key]) => key)}
            >
                <Checkbox value={EInntektstype.DAGSATS}>Dagsats</Checkbox>
                <Checkbox value={EInntektstype.MÅNEDSINNTEKT}>Månedsinntekt</Checkbox>
                <Checkbox value={EInntektstype.ÅRSINNTEKT}>Årsinntekt</Checkbox>
                <Checkbox value={EInntektstype.SAMORDNINGSFRADRAG}>Samordningsfradrag</Checkbox>
            </CheckboxGroupRow>
            <ReadMore header="Inntektsforklaring" size="small">
                {InntektsforklaringBody}
            </ReadMore>
            {Object.values(valgteInntektstyper).filter((valgt) => valgt).length > 0 ? (
                <>
                    <Grid lesevisning={!behandlingErRedigerbar}>
                        <TextLabel>Fra</TextLabel>
                        {valgteInntektstyper[EInntektstype.DAGSATS] && (
                            <TextLabel>Dagsats</TextLabel>
                        )}
                        {valgteInntektstyper[EInntektstype.MÅNEDSINNTEKT] && (
                            <TextLabel>Månedsinntekt</TextLabel>
                        )}
                        {valgteInntektstyper[EInntektstype.ÅRSINNTEKT] && (
                            <TextLabel>Årsinntekt (faktisk)</TextLabel>
                        )}
                        {valgteInntektstyper[EInntektstype.SAMORDNINGSFRADRAG] && (
                            <>
                                <TextLabel>Samordningsfradrag</TextLabel>
                                <TextLabel>Type samordningsfradrag</TextLabel>
                            </>
                        )}

                        {inntektsperiodeListe.value.map((rad, index) => {
                            const skalViseFjernKnapp =
                                behandlingErRedigerbar &&
                                index !== 0 &&
                                (skalViseLeggTilKnapp ||
                                    index === inntektsperiodeListe.value.length - 1);
                            return (
                                <React.Fragment key={rad.endretKey}>
                                    <MånedÅrVelger
                                        className={'ny-rad'}
                                        disabled={index === 0}
                                        feilmelding={
                                            valideringsfeil && valideringsfeil[index]?.årMånedFra
                                        }
                                        aria-label={'Inntekt fra'}
                                        onEndret={(e) => {
                                            oppdaterInntektslisteElement(
                                                index,
                                                EInntektsperiodeProperty.årMånedFra,
                                                e
                                            );
                                        }}
                                        årMånedInitiell={rad.årMånedFra}
                                        antallÅrTilbake={10}
                                        antallÅrFrem={4}
                                        lesevisning={!behandlingErRedigerbar}
                                    />
                                    {valgteInntektstyper[EInntektstype.DAGSATS] && (
                                        <StyledInput
                                            label={'Dagsats'}
                                            hideLabel
                                            erLesevisning={!behandlingErRedigerbar}
                                            value={harTallverdi(rad.dagsats) ? rad.dagsats : ''}
                                            onChange={(e) => {
                                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                                oppdaterInntektslisteElement(
                                                    index,
                                                    EInntektsperiodeProperty.dagsats,
                                                    tilTallverdi(e.target.value)
                                                );
                                            }}
                                        />
                                    )}
                                    {valgteInntektstyper[EInntektstype.MÅNEDSINNTEKT] && (
                                        <StyledInput
                                            label={'Månedsinntekt'}
                                            hideLabel
                                            erLesevisning={!behandlingErRedigerbar}
                                            value={
                                                harTallverdi(rad.månedsinntekt)
                                                    ? rad.månedsinntekt
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                                oppdaterInntektslisteElement(
                                                    index,
                                                    EInntektsperiodeProperty.månedsinntekt,
                                                    tilTallverdi(e.target.value)
                                                );
                                            }}
                                        />
                                    )}
                                    {valgteInntektstyper[EInntektstype.ÅRSINNTEKT] && (
                                        <StyledInput
                                            label={'Årsinntekt (faktisk)'}
                                            hideLabel
                                            type="number"
                                            value={
                                                harTallverdi(rad.forventetInntekt)
                                                    ? rad.forventetInntekt
                                                    : ''
                                            }
                                            onChange={(e) => {
                                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                                oppdaterInntektslisteElement(
                                                    index,
                                                    EInntektsperiodeProperty.forventetInntekt,
                                                    tilTallverdi(e.target.value)
                                                );
                                            }}
                                            erLesevisning={!behandlingErRedigerbar}
                                        />
                                    )}
                                    {valgteInntektstyper[EInntektstype.SAMORDNINGSFRADRAG] && (
                                        <>
                                            <StyledInput
                                                label={'Samordningsfradrag (mnd)'}
                                                hideLabel
                                                type="number"
                                                value={
                                                    harTallverdi(rad.samordningsfradrag)
                                                        ? rad.samordningsfradrag
                                                        : ''
                                                }
                                                onChange={(e) => {
                                                    settIkkePersistertKomponent(
                                                        VEDTAK_OG_BEREGNING
                                                    );
                                                    oppdaterInntektslisteElement(
                                                        index,
                                                        EInntektsperiodeProperty.samordningsfradrag,
                                                        tilTallverdi(e.target.value)
                                                    );
                                                }}
                                                erLesevisning={!behandlingErRedigerbar}
                                            />
                                            <div>
                                                <EnsligFamilieSelect
                                                    label={'Type samordninsfradrag'}
                                                    hideLabel
                                                    size={'medium'}
                                                    value={
                                                        skalVelgeSamordningstype
                                                            ? samordningsfradragstype.value
                                                            : ''
                                                    }
                                                    onChange={(event) => {
                                                        settIkkePersistertKomponent(
                                                            VEDTAK_OG_BEREGNING
                                                        );
                                                        samordningsfradragstype.onChange(event);
                                                    }}
                                                    disabled={
                                                        !skalVelgeSamordningstype || index > 0
                                                    }
                                                    erLesevisning={!behandlingErRedigerbar}
                                                    lesevisningVerdi={
                                                        samordningsfradragstype.value &&
                                                        samordningsfradagTilTekst[
                                                            samordningsfradragstype.value as ESamordningsfradragtype
                                                        ]
                                                    }
                                                >
                                                    <option value="">Velg</option>
                                                    <option
                                                        value={
                                                            ESamordningsfradragtype.GJENLEVENDEPENSJON
                                                        }
                                                    >
                                                        Gjenlevendepensjon
                                                    </option>
                                                    <option
                                                        value={ESamordningsfradragtype.UFØRETRYGD}
                                                    >
                                                        Uføretrygd
                                                    </option>
                                                </EnsligFamilieSelect>
                                                <EnsligErrorMessage>
                                                    {samordningValideringsfeil}
                                                </EnsligErrorMessage>
                                            </div>
                                        </>
                                    )}
                                    {skalViseLeggTilKnapp && (
                                        <Tooltip content="Legg til rad under" placement="right">
                                            <LeggTilKnapp
                                                onClick={() => {
                                                    leggTilTomRadUnder(index);
                                                }}
                                                ikontekst={'Legg til ny rad'}
                                            />
                                        </Tooltip>
                                    )}
                                    {skalViseFjernKnapp ? (
                                        <FjernKnapp
                                            onClick={() => {
                                                inntektsperiodeListe.remove(index);
                                                setValideringsFeil(
                                                    (prevState: FormErrors<InnvilgeVedtakForm>) => {
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
                                </React.Fragment>
                            );
                        })}
                    </Grid>
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
    );
};

const InntektsforklaringBody = (
    <FlexColumn>
        <BodyLong size="small">
            <strong>Datsats:</strong> blablabla
        </BodyLong>
        <BodyLong size="small">
            <strong>Månedsinntekt:</strong> blablabla
        </BodyLong>
        <BodyLong size="small">
            <strong>Årsinntekt:</strong> blablabla
        </BodyLong>
        <BodyLong size="small">
            <strong>Samordningsfradrag:</strong> blablabla
        </BodyLong>
    </FlexColumn>
);

export default InntektsperiodeValg;
