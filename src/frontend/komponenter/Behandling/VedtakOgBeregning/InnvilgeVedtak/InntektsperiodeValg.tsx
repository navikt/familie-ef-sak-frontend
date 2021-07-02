import { EInntektsperiodeProperty, IInntektsperiode } from '../../../../typer/vedtak';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import InputMedTusenSkille from '../../../Felleskomponenter/InputMedTusenskille';
import { harTallverdi, tilTallverdi } from '../../../../utils/utils';
import { useBehandling } from '../../../../context/BehandlingContext';
import MånedÅrVelger from '../../../Felleskomponenter/MånedÅr/MånedÅrVelger';
import FjernKnapp from '../../../Felleskomponenter/Knapper/FjernKnapp';
import LeggTilKnapp from '../../../Felleskomponenter/Knapper/LeggTilKnapp';
import { ListState } from '../../../../hooks/felles/useListState';
import { Element } from 'nav-frontend-typografi';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeVedtak';

const InntektContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-area: fraOgMedVelger inntekt samordningsfradrag fjernRadKnapp;
    grid-template-columns: repeat(3, 14rem) 3rem;
    grid-template-rows: auto;
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
`;

const TittelContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-area: fraOgMedVelger inntekt samordningsfradrag;
    grid-template-columns: repeat(3, 14rem);
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
`;

const StyledInput = styled(InputMedTusenSkille)`
    margin-right: 2rem;
`;

export const tomInntektsperiodeRad: IInntektsperiode = {
    årMånedFra: '',
};

interface Props {
    inntektsperiodeListe: ListState<IInntektsperiode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['inntekter'];
    setValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

const InntektsperiodeValg: React.FC<Props> = ({
    inntektsperiodeListe,
    valideringsfeil,
    setValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();

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

    return (
        <>
            <TittelContainer className={'blokk-s'}>
                <Element>Fra</Element>
                <Element>Forventet inntekt (år)</Element>
                <Element>Samordningsfradrag (mnd)</Element>
            </TittelContainer>
            {inntektsperiodeListe.value.map((rad, index) => {
                const skalViseFjernKnapp =
                    index === inntektsperiodeListe.value.length - 1 &&
                    index !== 0 &&
                    behandlingErRedigerbar;
                return (
                    <InntektContainer
                        key={index}
                        className={'blokk-s'}
                        lesevisning={!behandlingErRedigerbar}
                    >
                        <MånedÅrVelger
                            disabled={index === 0}
                            key={rad.endretKey || null}
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
                                oppdaterInntektslisteElement(
                                    index,
                                    EInntektsperiodeProperty.samordningsfradrag,
                                    tilTallverdi(e.target.value)
                                );
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                        />

                        {skalViseFjernKnapp && (
                            <FjernKnapp
                                onClick={() => {
                                    inntektsperiodeListe.remove(index);
                                    setValideringsFeil(
                                        (prevState: FormErrors<InnvilgeVedtakForm>) => {
                                            if (prevState) {
                                                const inntekter = prevState.inntekter.filter(
                                                    (_, i) => i !== index
                                                );
                                                return { ...prevState, inntekter: inntekter };
                                            }
                                            return prevState;
                                        }
                                    );
                                }}
                                knappetekst="Fjern inntektsperiode"
                            />
                        )}
                    </InntektContainer>
                );
            })}
            {behandlingErRedigerbar && (
                <LeggTilKnapp
                    onClick={() => inntektsperiodeListe.push(tomInntektsperiodeRad)}
                    knappetekst=" Legg til inntektsperiode"
                />
            )}
        </>
    );
};

export default InntektsperiodeValg;
