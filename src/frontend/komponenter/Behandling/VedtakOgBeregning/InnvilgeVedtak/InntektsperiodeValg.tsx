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
import { Ressurs } from '../../../../typer/ressurs';
import { useBehandling } from '../../../../context/BehandlingContext';
import { Undertittel } from 'nav-frontend-typografi';
import MånedÅrVelger from '../../../Felleskomponenter/MånedÅr/MånedÅrVelger';
import FjernKnapp from '../../../Felleskomponenter/Knapper/FjernKnapp';
import LeggTilKnapp from '../../../Felleskomponenter/Knapper/LeggTilKnapp';

const InntektContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: repeat(8, max-content);
    grid-template-rows: repeat(3, 1fr);
    grid-auto-rows: min-content;
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
    align-items: center;

    .forsteKolonne {
        grid-column: 1/2;
    }

    .inntektrad {
        grid-column: 1/6;
    }
`;

const StyledInput = styled(InputMedTusenSkille)`
    min-width: 160px;
    max-width: 200px;
    margin-right: 2rem;
`;

const StyledSamordningsfradrag = styled(StyledInput)`
    min-width: 200px;
`;
export const tomInntektsperiodeRad: IInntektsperiode = {
    årMånedFra: '',
};

export interface IInntektsperiodeData {
    inntektsperiodeListe: IInntektsperiode[];
    inntektBegrunnelse: string;
}

interface Props {
    inntektsperiodeData: IInntektsperiodeData;
    settInntektsperiodeData: (verdi: IInntektsperiodeData) => void;
    valideringsfeil?: IValideringsfeil['inntekt'];
    beregnetStønad: Ressurs<IBeløpsperiode[]>;
    beregnPerioder: () => void;
}

const InntektsperiodeValg: React.FC<Props> = ({
    inntektsperiodeData,
    settInntektsperiodeData,
    valideringsfeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { inntektsperiodeListe } = inntektsperiodeData;

    const oppdaterInntektslisteElement = (
        index: number,
        property: EInntektsperiodeProperty,
        value: string | number | undefined
    ) => {
        const oppdatertListe = inntektsperiodeListe.map((inntektsperiode, i) => {
            return i === index ? { ...inntektsperiode, [property]: value } : inntektsperiode;
        });

        settInntektsperiodeData({
            ...inntektsperiodeData,
            inntektsperiodeListe: oppdatertListe,
        });
    };

    const leggTilInntektsperiode = () => {
        settInntektsperiodeData({
            ...inntektsperiodeData,
            inntektsperiodeListe: [...inntektsperiodeListe, tomInntektsperiodeRad],
        });
    };

    const fjernInntektsperiode = () => {
        const nyListe = [...inntektsperiodeListe];
        nyListe.pop();
        settInntektsperiodeData({
            ...inntektsperiodeData,
            inntektsperiodeListe: nyListe,
        });
    };

    return (
        <>
            <Undertittel className={'blokk-s'}>Inntekt</Undertittel>
            {inntektsperiodeListe.map((rad, index) => {
                return (
                    <InntektContainer
                        key={index}
                        className={'blokk-s'}
                        lesevisning={!behandlingErRedigerbar}
                    >
                        <MånedÅrVelger
                            className={'forsteKolonne'}
                            key={rad.endretKey || null}
                            disabled={index === 0}
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
                            label={index === 0 ? 'Forventet inntekt (år)' : undefined}
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

                        <StyledSamordningsfradrag
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

                        {index === inntektsperiodeListe.length - 1 &&
                            index !== 0 &&
                            behandlingErRedigerbar && (
                                <FjernKnapp
                                    onClick={fjernInntektsperiode}
                                    knappetekst="Fjern inntektsperiode"
                                />
                            )}
                    </InntektContainer>
                );
            })}
            {behandlingErRedigerbar && (
                <LeggTilKnapp
                    onClick={leggTilInntektsperiode}
                    knappetekst=" Legg til inntektsperiode"
                />
            )}
        </>
    );
};

export default InntektsperiodeValg;
