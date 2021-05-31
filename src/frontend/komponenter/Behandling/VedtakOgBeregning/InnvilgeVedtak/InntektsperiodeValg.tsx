import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import {
    EInntektsperiodeProperty,
    IBeløpsperiode,
    IInntektsperiode,
} from '../../../../typer/vedtak';
import { AddCircle, Delete } from '@navikt/ds-icons';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Flatknapp, Knapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import InputMedTusenSkille from '../../../Felleskomponenter/InputMedTusenskille';
import { harTallverdi, tilTallverdi } from '../../../../utils/utils';
import Utregningstabell from './Utregningstabell';
import { Ressurs } from '../../../../typer/ressurs';
import { useBehandling } from '../../../../context/BehandlingContext';
import { FamilieTextarea } from '@navikt/familie-form-elements';
import { IngenBegrunnelseOppgitt } from './VedtaksperiodeValg';
import MånedÅrVelger from '../../../Felleskomponenter/MånedÅr/MånedÅrVelger';

const InntektContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: repeat(8, max-content);
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

const InntektsperiodeRad = styled.div`
    display: contents;
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
    min-width: 160px;
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

const TextareaWrapper = styled.div`
    max-width: 60rem;
`;

const StyledFamilieTextarea = styled(FamilieTextarea)`
    white-space: pre-wrap;
    word-wrap: break-word;
    .typo-element {
        padding-bottom: 0.5rem;
    }
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
    beregnPerioder: () => void;
}

const InntektsperiodeValg: React.FC<Props> = ({
    inntektsperiodeData,
    settInntektsperiodeData,
    valideringsfeil,
    beregnetStønad,
    beregnPerioder,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
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
            <Undertittel className={'blokk-s'}>Inntekt</Undertittel>
            <InntektContainer className={'blokk-s'} lesevisning={!behandlingErRedigerbar}>
                <Element>Fra</Element>
                <Element>Forventet inntekt (år)</Element>
                <Element>Samordningsfradrag (mnd)</Element>

                {inntektsperiodeListe.map((rad, index) => {
                    return (
                        <InntektsperiodeRad key={index} className={'inntektrad'}>
                            <MånedÅrVelger
                                className={'forsteKolonne'}
                                key={rad.endretKey || null}
                                disabled={index === 0}
                                aria-label={'Fra'}
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
                                aria-label={'Forventet inntekt (år)'}
                                type="number"
                                value={
                                    harTallverdi(rad.forventetInntekt) ? rad.forventetInntekt : ''
                                }
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
                                    harTallverdi(rad.samordningsfradrag)
                                        ? rad.samordningsfradrag
                                        : ''
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

                            {behandlingErRedigerbar && (
                                <MndKnappWrapper>
                                    {index === inntektsperiodeListe.length - 1 && index !== 0 && (
                                        <FjernPeriodeKnapp onClick={fjernInntektsperiode}>
                                            <Delete />
                                            <span className="sr-only">Fjern inntektsperiode</span>
                                        </FjernPeriodeKnapp>
                                    )}
                                </MndKnappWrapper>
                            )}
                        </InntektsperiodeRad>
                    );
                })}
            </InntektContainer>

            {valideringsfeil.map((feil) => (
                <AlertStripeFeil>{feil}</AlertStripeFeil>
            ))}

            {behandlingErRedigerbar && (
                <>
                    <KnappMedLuftUnder className={'blokk-s'} onClick={leggTilInntektsperiode}>
                        <AddCircle style={{ marginRight: '1rem' }} />
                        Legg til inntektsperiode
                    </KnappMedLuftUnder>
                    <div className={'blokk-m'}>
                        <Knapp type={'standard'} onClick={beregnPerioder}>
                            Beregn
                        </Knapp>
                    </div>
                </>
            )}

            <Utregningstabell beregnetStønad={beregnetStønad} />

            {!behandlingErRedigerbar && inntektBegrunnelse === '' ? (
                <IngenBegrunnelseOppgitt>
                    <Element className={'blokk-xxs'}>Begrunnelse</Element>
                    <Normaltekst style={{ fontStyle: 'italic' }}>
                        Ingen opplysninger oppgitt.
                    </Normaltekst>
                </IngenBegrunnelseOppgitt>
            ) : (
                <TextareaWrapper>
                    <StyledFamilieTextarea
                        value={inntektBegrunnelse}
                        onChange={(e) => {
                            settInntektBegrunnelse(e.target.value);
                        }}
                        label="Begrunnelse"
                        maxLength={0}
                        erLesevisning={!behandlingErRedigerbar}
                    />
                </TextareaWrapper>
            )}
        </>
    );
};

export default InntektsperiodeValg;
