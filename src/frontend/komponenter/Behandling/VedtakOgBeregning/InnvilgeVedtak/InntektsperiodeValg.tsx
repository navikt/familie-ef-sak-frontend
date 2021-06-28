import {
    EInntektsperiodeProperty,
    IBeløpsperiode,
    IInntektsperiode,
    IValideringsfeil,
} from '../../../../typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import InputMedTusenSkille from '../../../Felleskomponenter/InputMedTusenskille';
import { harTallverdi, tilTallverdi } from '../../../../utils/utils';
import { useBehandling } from '../../../../context/BehandlingContext';
import MånedÅrVelger from '../../../Felleskomponenter/MånedÅr/MånedÅrVelger';
import FjernKnapp from '../../../Felleskomponenter/Knapper/FjernKnapp';
import LeggTilKnapp from '../../../Felleskomponenter/Knapper/LeggTilKnapp';
import { ListState } from '../../../../hooks/felles/useListState';
import { FieldState } from '../../../../hooks/felles/useFieldState';
import { Ressurs } from '../../../../typer/ressurs';
import { Element } from 'nav-frontend-typografi';

const InntektContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-area: fraOgMedVelger inntekt samordningsfradrag fjernknapp;
    grid-template-columns: 14rem minmax(10rem, 12rem) 14rem 3rem;
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
    align-items: center;
`;

const TittelContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-area: fraOgMedVelger inntekt samordningsfradrag;
    grid-template-columns: 14rem minmax(10rem, 12rem) 14rem;
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
    align-items: center;
`;

const StyledInput = styled(InputMedTusenSkille)`
    margin-right: 2rem;
`;

export const tomInntektsperiodeRad: IInntektsperiode = {
    årMånedFra: '',
};

interface Props {
    inntektsperiodeListe: ListState<IInntektsperiode>;
    valideringsfeil?: IValideringsfeil['inntekt'];
    inntektBegrunnelse: FieldState;
    beregnPerioder: () => void;
    beregnetStønad: Ressurs<IBeløpsperiode[]>;
}

const InntektsperiodeValg: React.FC<Props> = ({ inntektsperiodeListe }) => {
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
                return (
                    <InntektContainer
                        key={index}
                        className={'blokk-s'}
                        lesevisning={!behandlingErRedigerbar}
                    >
                        <MånedÅrVelger
                            className={index === 0 ? '' : ''}
                            key={rad.endretKey || null}
                            disabled={index === 0}
                            index={index}
                            aria-label={index === 0 ? 'Fra' : undefined}
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

                        {index === inntektsperiodeListe.value.length - 1 &&
                            index !== 0 &&
                            behandlingErRedigerbar && (
                                <FjernKnapp
                                    onClick={() => inntektsperiodeListe.remove(index)}
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
