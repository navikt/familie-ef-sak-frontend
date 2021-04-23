import { Element } from 'nav-frontend-typografi';
import { EInntektsperiodeProperty, IBeløpsperiode, IInntektsperiode } from '../../../typer/vedtak';
import { AddCircle, Delete } from '@navikt/ds-icons';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Textarea } from 'nav-frontend-skjema';
import MånedÅrVelger from '../../Felleskomponenter/MånedÅr/MånedÅrVelger';
import { Flatknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import InputMedTusenSkille from '../../Felleskomponenter/InputMedTusenskille';
import { harTallverdi, tilTallverdi } from '../../../utils/utils';
import Utregningstabell from './Utregningstabell';
import { Ressurs } from '../../../typer/ressurs';

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

const StyledInput = styled(InputMedTusenSkille)`
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
}

interface Props {
    inntektsperiodeData: IInntektsperiodeData;
    settInntektsperiodeData: (verdi: IInntektsperiodeData) => void;
    valideringsfeil: string[];
    beregnetStønad: Ressurs<IBeløpsperiode[]>;
}

const InntektsperiodeValg: React.FC<Props> = ({
    inntektsperiodeData,
    settInntektsperiodeData,
    valideringsfeil,
    beregnetStønad,
}) => {
    const { inntektsperiodeListe, inntektBegrunnelse } = inntektsperiodeData;

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

    return (
        <>
            <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>Inntekt</Element>
            {inntektsperiodeListe.map((rad, index) => {
                return (
                    <InntektsperiodeRad key={index}>
                        <MånedÅrVelger
                            key={rad.endretKey || null}
                            disabled={index === 0}
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
                            aria-label={index !== 0 ? 'Forventet inntekt (år)' : ''}
                            type="number"
                            value={harTallverdi(rad.forventetInntekt) ? rad.forventetInntekt : ''}
                            onChange={(e) => {
                                oppdaterInntektslisteElement(
                                    index,
                                    EInntektsperiodeProperty.forventetInntekt,
                                    tilTallverdi(e.target.value)
                                );
                            }}
                        />

                        <StyledSamordningsfradrag
                            label={index === 0 && 'Samordningsfradrag (mnd)'}
                            aria-label={index !== 0 ? 'Samordningsfradrag (mnd)' : ''}
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
                        />

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
            <Utregningstabell beregnetStønad={beregnetStønad} />
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
