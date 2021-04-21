import { Element } from 'nav-frontend-typografi';
import { EInntektsperiodeProperty, IInntektsperiode } from '../../../typer/vedtak';
import { AddCircle, Delete } from '@navikt/ds-icons';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Checkbox, Input, Textarea } from 'nav-frontend-skjema';
import MånedÅrVelger from '../../Felleskomponenter/MånedÅr/MånedÅrVelger';
import { Flatknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';

const Inntekt = styled.div`
    padding-bottom: 2rem;
`;

const Knapper = styled.div`
    max-width: 500px;
    display: flex;
    justify-content: space-between;
`;

const InntektsperiodeRad = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.25rem;
`;

const KnappMedLuftUnder = styled(Flatknapp)`
    padding: 0;
    margin-bottom: 1rem;
`;

const FjernPeriodeKnapp = styled(Flatknapp)`
    padding: 0;
    margin-left: 1rem;
`;

const StyledInput = styled(Input)`
    max-width: 200px;
    margin-right: 2rem;
`;

const StyledSamordningsfradrag = styled(StyledInput)`
    min-width: 200px;
`;

const MndKnappWrapper = styled.div`
    width: 90px;
    display: flex;
`;

export const tomInntektsperiodeRad: IInntektsperiode = {
    årMånedFra: '',
};

export interface IInntektsperiodeData {
    inntektsperiodeListe: IInntektsperiode[];
    inntektBegrunnelse: string;
    visSamordning: boolean;
}

interface Props {
    inntektsperiodeData: IInntektsperiodeData;
    settInntektsperiodeData: (verdi: IInntektsperiodeData) => void;
    valideringsfeil: string[];
}

const InntektsperiodeValg: React.FC<Props> = ({
    inntektsperiodeData,
    settInntektsperiodeData,
    valideringsfeil,
}) => {
    const { inntektsperiodeListe, visSamordning, inntektBegrunnelse } = inntektsperiodeData;

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

    const settInntektBegrunnelse = (begrunnelse: string) =>
        settInntektsperiodeData({ ...inntektsperiodeData, inntektBegrunnelse: begrunnelse });

    const settVisSamordning = (samordning: boolean) =>
        settInntektsperiodeData({ ...inntektsperiodeData, visSamordning: samordning });

    return (
        <>
            <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>Inntekt</Element>
            <Inntekt>
                <Checkbox
                    label="Vis samordning"
                    onChange={() => {
                        settVisSamordning(!visSamordning);
                    }}
                    checked={visSamordning}
                />
            </Inntekt>
            {inntektsperiodeListe.map((rad, index) => {
                return (
                    <InntektsperiodeRad key={index}>
                        <MånedÅrVelger
                            label={index === 0 ? 'Fra' : ''}
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
                        />

                        <StyledInput
                            label={index === 0 && 'Forventet inntekt (år)'}
                            type="number"
                            value={rad.forventetInntekt === undefined ? '' : rad.forventetInntekt}
                            onChange={(e) => {
                                oppdaterInntektslisteElement(
                                    index,
                                    EInntektsperiodeProperty.forventetInntekt,
                                    parseInt(e.target.value, 10)
                                );
                            }}
                        />

                        {visSamordning && (
                            <StyledSamordningsfradrag
                                label={index === 0 && 'Samordningsfradrag (mnd)'}
                                type="number"
                                value={
                                    rad.samordningsfradrag === undefined
                                        ? ''
                                        : rad.samordningsfradrag
                                }
                                onChange={(e) => {
                                    oppdaterInntektslisteElement(
                                        index,
                                        EInntektsperiodeProperty.samordningsfradrag,
                                        parseInt(e.target.value, 10)
                                    );
                                }}
                            />
                        )}

                        <MndKnappWrapper>
                            {index === inntektsperiodeListe.length - 1 && index !== 0 && (
                                <FjernPeriodeKnapp onClick={fjernInntektsperiode}>
                                    <Delete />
                                    <span className="sr-only">Fjern inntektsperiode</span>
                                </FjernPeriodeKnapp>
                            )}
                        </MndKnappWrapper>
                    </InntektsperiodeRad>
                );
            })}
            {valideringsfeil.map((feil) => (
                <AlertStripeFeil>{feil}</AlertStripeFeil>
            ))}
            <Knapper>
                <KnappMedLuftUnder onClick={leggTilInntektsperiode}>
                    <AddCircle style={{ marginRight: '1rem' }} />
                    Legg til inntektsperiode
                </KnappMedLuftUnder>
            </Knapper>
            <Textarea
                value={inntektBegrunnelse}
                onChange={(e) => {
                    settInntektBegrunnelse(e.target.value);
                }}
                label="Begrunnelse"
            />
        </>
    );
};

export default InntektsperiodeValg;
