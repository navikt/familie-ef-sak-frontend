import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import {
    EAktivitet,
    EPeriodeProperty,
    EPeriodetype,
    IValideringsfeil,
    IVedtaksperiode,
    periodeVariantTilProperty,
} from '../../../../typer/vedtak';
import AktivitetspliktVelger from './AktivitetspliktVelger';
import MånedÅrPeriode, { PeriodeVariant } from '../../../Felleskomponenter/MånedÅr/MånedÅrPeriode';
import { AddCircle, Delete } from '@navikt/ds-icons';
import { Flatknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { månederMellom, månedÅrTilDate } from '../../../../utils/dato';
import { useBehandling } from '../../../../context/BehandlingContext';
import { FamilieTextarea } from '@navikt/familie-form-elements';
import VedtakperiodeSelect from './VedtakperiodeSelect';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';

const VedtakContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    grid-template-rows: 1fr 1fr;
    grid-auto-rows: min-content;
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
    align-items: center;

    .forsteKolonne {
        grid-column: 1/2;
    }

    .vedtakrad {
        grid-column: 1/6;
    }
`;

const VedtaksperiodeRad = styled.div`
    display: contents;
`;

export const IngenBegrunnelseOppgitt = styled.div`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

const KnappMedLuftUnder = styled(Flatknapp)`
    padding: 0;
    margin-bottom: 1rem;
`;

const FjernPeriodeKnapp = styled(Flatknapp)`
    padding: 0;
    margin-left: 1rem;
`;

const MndKnappWrapper = styled.div`
    width: 90px;
    display: flex;
    align-items: center;
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

export interface IVedtaksperiodeData {
    vedtaksperiodeListe: IVedtaksperiode[];
    periodeBegrunnelse: string;
}

interface Props {
    vedtaksperiodeData: IVedtaksperiodeData;
    settVedtaksperiodeData: (verdi: IVedtaksperiodeData) => void;
    vedtaksperioderFeil: IValideringsfeil['vedtaksperioder'];
    aktivitetstypeFeil: IValideringsfeil['aktivitet'];
}

export const tomVedtaksperiodeRad: IVedtaksperiode = {
    periodeType: '' as EPeriodetype,
    aktivitet: '' as EAktivitet,
};

const kalkulerAntallMåneder = (årMånedFra?: string, årMånedTil?: string): number | undefined => {
    if (årMånedFra && årMånedTil) {
        return månederMellom(månedÅrTilDate(årMånedFra), månedÅrTilDate(årMånedTil));
    }
    return undefined;
};

const VedtaksperiodeValg: React.FC<Props> = ({
    vedtaksperiodeData,
    settVedtaksperiodeData,
    vedtaksperioderFeil,
    aktivitetstypeFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const settPeriodeBegrunnelse = (begrunnelse: string) =>
        settVedtaksperiodeData({
            ...vedtaksperiodeData,
            periodeBegrunnelse: begrunnelse,
        });

    const leggTilVedtaksperiode = () =>
        settVedtaksperiodeData({
            ...vedtaksperiodeData,
            vedtaksperiodeListe: [...vedtaksperiodeData.vedtaksperiodeListe, tomVedtaksperiodeRad],
        });

    const fjernVedtaksperiode = () => {
        const nyListe = [...vedtaksperiodeData.vedtaksperiodeListe];
        nyListe.pop();
        settVedtaksperiodeData({
            ...vedtaksperiodeData,
            vedtaksperiodeListe: nyListe,
        });
    };

    const oppdaterVedtakslisteElement = (
        index: number,
        property: EPeriodeProperty,
        value: string | number | undefined
    ) => {
        const oppdatertListe = vedtaksperiodeData.vedtaksperiodeListe.map((vedtaksperiode, i) => {
            return i === index
                ? {
                      ...vedtaksperiode,
                      [property]: value,
                      ...(property === EPeriodeProperty.periodeType && {
                          [EPeriodeProperty.aktivitet]:
                              value === EPeriodetype.PERIODE_FØR_FØDSEL
                                  ? EAktivitet.IKKE_AKTIVITETSPLIKT
                                  : undefined,
                      }),
                  }
                : vedtaksperiode;
        });
        settVedtaksperiodeData({
            ...vedtaksperiodeData,
            vedtaksperiodeListe: oppdatertListe,
        });
    };

    return (
        <section className={'blokk-xl'}>
            <Undertittel className={'blokk-s'}>Vedtaksperiode</Undertittel>
            <VedtakContainer className={'blokk-s'} lesevisning={!behandlingErRedigerbar}>
                <Element>Periodetype</Element>
                <Element>Aktivitet</Element>
                <Element>Fra og med</Element>
                <Element>Til og med</Element>

                {vedtaksperiodeData.vedtaksperiodeListe.map((vedtaksperiode, index) => {
                    const { periodeType, aktivitet, årMånedFra, årMånedTil } = vedtaksperiode;
                    const antallMåneder = kalkulerAntallMåneder(årMånedFra, årMånedTil);

                    return (
                        <VedtaksperiodeRad key={index} className={'vedtakrad'}>
                            <VedtakperiodeSelect
                                className={'forsteKolonne'}
                                oppdaterVedtakslisteElement={oppdaterVedtakslisteElement}
                                behandlingErRedigerbar={behandlingErRedigerbar}
                                periodeType={periodeType}
                                index={index}
                            />
                            <AktivitetspliktVelger
                                index={index}
                                aktivitet={aktivitet}
                                periodeType={periodeType}
                                oppdaterVedtakslisteElement={oppdaterVedtakslisteElement}
                                erLesevisning={!behandlingErRedigerbar}
                                aktivitetfeil={aktivitetstypeFeil && aktivitetstypeFeil[index]}
                            />
                            <MånedÅrPeriode
                                datoFraTekst={''}
                                datoTilTekst={''}
                                årMånedFraInitiell={årMånedFra}
                                årMånedTilInitiell={årMånedTil}
                                onEndre={(
                                    verdi: string | undefined,
                                    periodeVariant: PeriodeVariant
                                ) => {
                                    oppdaterVedtakslisteElement(
                                        index,
                                        periodeVariantTilProperty(periodeVariant),
                                        verdi
                                    );
                                }}
                                erLesevisning={!behandlingErRedigerbar}
                            />
                            <MndKnappWrapper>
                                <Element style={{}}>
                                    {!!antallMåneder && `${antallMåneder} mnd`}
                                </Element>
                                {behandlingErRedigerbar &&
                                    index === vedtaksperiodeData.vedtaksperiodeListe.length - 1 &&
                                    index !== 0 && (
                                        <FjernPeriodeKnapp onClick={fjernVedtaksperiode}>
                                            <Delete />
                                            <span className="sr-only">Fjern vedtaksperiode</span>
                                        </FjernPeriodeKnapp>
                                    )}
                            </MndKnappWrapper>
                            {vedtaksperioderFeil && (
                                <SkjemaelementFeilmelding style={{ gridColumn: '3/4' }}>
                                    {vedtaksperioderFeil[index]}
                                </SkjemaelementFeilmelding>
                            )}
                        </VedtaksperiodeRad>
                    );
                })}
            </VedtakContainer>

            {behandlingErRedigerbar && (
                <KnappMedLuftUnder onClick={leggTilVedtaksperiode}>
                    <AddCircle style={{ marginRight: '1rem' }} />
                    Legg til vedtaksperiode
                </KnappMedLuftUnder>
            )}
            {!behandlingErRedigerbar && vedtaksperiodeData.periodeBegrunnelse === '' ? (
                <IngenBegrunnelseOppgitt>
                    <Element className={'blokk-xxs'}>Begrunnelse</Element>
                    <Normaltekst style={{ fontStyle: 'italic' }}>
                        Ingen opplysninger oppgitt.
                    </Normaltekst>
                </IngenBegrunnelseOppgitt>
            ) : (
                <TextareaWrapper>
                    <StyledFamilieTextarea
                        value={vedtaksperiodeData.periodeBegrunnelse}
                        onChange={(e) => {
                            settPeriodeBegrunnelse(e.target.value);
                        }}
                        label="Begrunnelse"
                        maxLength={0}
                        erLesevisning={!behandlingErRedigerbar}
                    />
                </TextareaWrapper>
            )}
        </section>
    );
};

export default VedtaksperiodeValg;
