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
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeVedtak';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { Tooltip } from '@navikt/ds-react';
import { v4 as uuidv4 } from 'uuid';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import { EnsligErrorMessage } from '../../../../../Felles/ErrorMessage/EnsligErrorMessage';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { TextLabel } from '../../../../../Felles/Visningskomponenter/Tekster';

const Grid = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 11rem 13.5rem 13rem' : '13rem 12rem 12rem 12rem 3rem 3rem'};
    grid-gap: 1rem;
    margin-bottom: 0.5rem;
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;

export const tomInntektsperiodeRad = (årMånedFra?: string): IInntektsperiode => ({
    årMånedFra: årMånedFra || '',
    endretKey: uuidv4(),
});

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
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const skalViseLeggTilKnapp = behandlingErRedigerbar;

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

    return (
        <div className={className}>
            <Grid lesevisning={!behandlingErRedigerbar}>
                <TextLabel>Fra</TextLabel>
                <TextLabel>Forventet inntekt (år)</TextLabel>
                <TextLabel>Samordningsfradrag (mnd)</TextLabel>
                <TextLabel>Type samordningsfradrag</TextLabel>
            </Grid>
            {inntektsperiodeListe.value.map((rad, index) => {
                const skalViseFjernKnapp =
                    behandlingErRedigerbar &&
                    index !== 0 &&
                    (skalViseLeggTilKnapp || index === inntektsperiodeListe.value.length - 1);
                return (
                    <Grid key={rad.endretKey} lesevisning={!behandlingErRedigerbar}>
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
                            label={'Forventet inntekt'}
                            hideLabel
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
                            label={'Samordningsfradrag (mnd)'}
                            hideLabel
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
                            <EnsligFamilieSelect
                                label={'Type samordninsfradrag'}
                                hideLabel
                                size={'medium'}
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
                            </EnsligFamilieSelect>
                            <EnsligErrorMessage>{samordningValideringsfeil}</EnsligErrorMessage>
                        </div>
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
                                            const inntekter = (prevState.inntekter ?? []).filter(
                                                (_, i) => i !== index
                                            );
                                            return { ...prevState, inntekter };
                                        }
                                    );
                                }}
                                ikontekst={'Fjern inntektsperiode'}
                            />
                        ) : (
                            <div />
                        )}
                    </Grid>
                );
            })}
            {behandlingErRedigerbar && (
                <LeggTilKnapp
                    onClick={() => inntektsperiodeListe.push(tomInntektsperiodeRad())}
                    knappetekst=" Legg til inntektsperiode"
                />
            )}
        </div>
    );
};

export default InntektsperiodeValg;
