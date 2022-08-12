import {
    EInntektsperiodeProperty,
    ESamordningsfradragtype,
    IInntektsperiode,
    samordningsfradagTilTekst,
} from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import InputMedTusenSkille from '../../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { harTallverdi, tilTallverdi } from '../../../../../App/utils/utils';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { Element } from 'nav-frontend-typografi';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeVedtak';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import { FamilieSelect } from '@navikt/familie-form-elements';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';
import { useToggles } from '../../../../../App/context/TogglesContext';
import { ToggleName } from '../../../../../App/context/toggles';
import { Tooltip } from '@navikt/ds-react';
import { v4 as uuidv4 } from 'uuid';

const InntektContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-area: fraOgMedVelger inntekt samordningsfradrag samordningsfradragstype fjernRadKnapp leggTilKnapp;
    grid-template-columns: ${(props) =>
        props.lesevisning ? '6.5rem 10rem 12.5rem 12rem' : '11.5rem 12rem 12rem 12rem 3rem 3rem'};
    grid-gap: 1rem;
`;

const TittelContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-area: fraOgMedVelger inntekt samordningsfradrag samordningsfradragstype;
    grid-template-columns: ${(props) =>
        props.lesevisning ? '6.5rem 10rem 12.5rem 12rem' : '11.5rem 12rem 12rem 12rem 4rem'};
    grid-gap: 1rem;
    margin-bottom: 0.5rem;
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;

export const tomInntektsperiodeRad = (): IInntektsperiode => ({
    årMånedFra: '',
    endretKey: uuidv4(),
});

interface Props {
    inntektsperiodeListe: ListState<IInntektsperiode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['inntekter'];
    setValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    samordningsfradragstype: FieldState;
    skalVelgeSamordningstype: boolean;
    samordningValideringsfeil?: FormErrors<InnvilgeVedtakForm>['samordningsfradragType'];
}

const InntektsperiodeValg: React.FC<Props> = ({
    inntektsperiodeListe,
    valideringsfeil,
    setValideringsFeil,
    samordningsfradragstype,
    skalVelgeSamordningstype,
    samordningValideringsfeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const { toggles } = useToggles();
    const skalViseLeggTilKnapp =
        toggles[ToggleName.visVedtakPeriodeLeggTilRad] && behandlingErRedigerbar;

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

    const leggTilTomRadOver = (index: number) => {
        inntektsperiodeListe.setValue((prevState) => [
            ...prevState.slice(0, index),
            tomInntektsperiodeRad(),
            ...prevState.slice(index, prevState.length),
        ]);
    };

    return (
        <>
            <TittelContainer lesevisning={!behandlingErRedigerbar}>
                <Element>Fra</Element>
                <Element>Forventet inntekt (år)</Element>
                <Element>Samordningsfradrag (mnd)</Element>
                <Element>Type samordningsfradrag</Element>
            </TittelContainer>
            {inntektsperiodeListe.value.map((rad, index) => {
                const skalViseFjernKnapp =
                    behandlingErRedigerbar &&
                    (skalViseLeggTilKnapp ||
                        (index === inntektsperiodeListe.value.length - 1 && index !== 0));
                return (
                    <InntektContainer key={rad.endretKey} lesevisning={!behandlingErRedigerbar}>
                        <MånedÅrVelger
                            disabled={index === 0}
                            feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
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

                        <StyledInput
                            type="number"
                            value={harTallverdi(rad.forventetInntekt) ? rad.forventetInntekt : ''}
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
                        <StyledInput
                            aria-label={'Samordningsfradrag (mnd)'}
                            type="number"
                            value={
                                harTallverdi(rad.samordningsfradrag) ? rad.samordningsfradrag : ''
                            }
                            onChange={(e) => {
                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                oppdaterInntektslisteElement(
                                    index,
                                    EInntektsperiodeProperty.samordningsfradrag,
                                    tilTallverdi(e.target.value)
                                );
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <div>
                            <FamilieSelect
                                aria-label={'Type samordninsfradrag'}
                                bredde={'m'}
                                value={
                                    skalVelgeSamordningstype ? samordningsfradragstype.value : ''
                                }
                                onChange={(event) => {
                                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                    samordningsfradragstype.onChange(event);
                                }}
                                disabled={!skalVelgeSamordningstype || index > 0}
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
                            </FamilieSelect>
                            <SkjemaelementFeilmelding>
                                {samordningValideringsfeil}
                            </SkjemaelementFeilmelding>
                        </div>
                        {skalViseFjernKnapp && (
                            <FjernKnapp
                                onClick={() => {
                                    inntektsperiodeListe.remove(index);
                                    setValideringsFeil(
                                        (prevState: FormErrors<InnvilgeVedtakForm>) => {
                                            const inntekter = (prevState.inntekter ?? []).filter(
                                                (_, i) => i !== index
                                            );
                                            return { ...prevState, inntekter: inntekter };
                                        }
                                    );
                                }}
                                knappetekst="Fjern inntektsperiode"
                            />
                        )}
                        {skalViseLeggTilKnapp && (
                            <Tooltip content="Legg til rad over" placement="right">
                                <LeggTilKnapp
                                    onClick={() => {
                                        leggTilTomRadOver(index);
                                    }}
                                />
                            </Tooltip>
                        )}
                    </InntektContainer>
                );
            })}
            {behandlingErRedigerbar && (
                <LeggTilKnapp
                    onClick={() => inntektsperiodeListe.push(tomInntektsperiodeRad())}
                    knappetekst=" Legg til inntektsperiode"
                />
            )}
        </>
    );
};

export default InntektsperiodeValg;
