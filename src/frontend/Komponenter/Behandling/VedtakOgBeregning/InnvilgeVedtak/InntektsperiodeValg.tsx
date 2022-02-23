import {
    EInntektsperiodeProperty,
    ESamordningsfradragtype,
    IInntektsperiode,
    samordningsfradragstypeTilTekst,
} from '../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { harTallverdi, tilTallverdi } from '../../../../App/utils/utils';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import MånedÅrVelger from '../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeVedtak';
import { VEDTAK_OG_BEREGNING } from '../konstanter';
import { useApp } from '../../../../App/context/AppContext';

const InntektContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-area: fraOgMedVelger inntekt samordningsfradrag samordningsfradragstype fjernRadKnapp;
    grid-template-columns: repeat(4, 12rem);
    grid-gap: 1rem;
`;

const TittelContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-area: fraOgMedVelger inntekt samordningsfradrag samordningsfradragstype;
    grid-template-columns: repeat(4, 12rem);
    grid-gap: 1rem;
    margin-bottom: 0.5rem;
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;

export const tomInntektsperiodeRad: IInntektsperiode = {
    årMånedFra: '',
};

interface Props {
    inntektsperiodeListe: ListState<IInntektsperiode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['inntekter'];
    setValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    samordningsfradragstype?: ESamordningsfradragtype;
}

const InntektsperiodeValg: React.FC<Props> = ({
    inntektsperiodeListe,
    valideringsfeil,
    setValideringsFeil,
    samordningsfradragstype,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

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
            <TittelContainer>
                <Element>Fra</Element>
                <Element>Forventet inntekt (år)</Element>
                <Element>Samordningsfradrag (mnd)</Element>
                {samordningsfradragstype && <Element>Type samordningsfradrag</Element>}
            </TittelContainer>
            {inntektsperiodeListe.value.map((rad, index) => {
                const skalViseFjernKnapp =
                    index === inntektsperiodeListe.value.length - 1 &&
                    index !== 0 &&
                    behandlingErRedigerbar;
                return (
                    <InntektContainer key={index} lesevisning={!behandlingErRedigerbar}>
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
                        {samordningsfradragstype && (
                            <Normaltekst>
                                {samordningsfradragstypeTilTekst[samordningsfradragstype]}
                            </Normaltekst>
                        )}
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
