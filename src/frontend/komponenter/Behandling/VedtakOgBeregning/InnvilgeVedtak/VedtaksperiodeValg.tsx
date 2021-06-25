import { Undertittel } from 'nav-frontend-typografi';
import {
    EAktivitet,
    EPeriodeProperty,
    EPeriodetype,
    IValideringsfeil,
    IVedtaksperiode,
    periodeVariantTilProperty,
} from '../../../../typer/vedtak';
import AktivitetspliktVelger from './AktivitetspliktVelger';
import MånedÅrPeriode from '../../../Felleskomponenter/MånedÅr/MånedÅrPeriode';
import React from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../context/BehandlingContext';
import VedtakperiodeSelect from './VedtakperiodeSelect';
import LeggTilKnapp from '../../../Felleskomponenter/Knapper/LeggTilKnapp';
import FjernKnapp from '../../../Felleskomponenter/Knapper/FjernKnapp';

const VedtakContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'periodetype aktivitetstype periodevelger ting';
    grid-template-columns: minmax(10rem, 16rem) 8rem minmax(10rem, 1fr) 8rem;
    grid-template-rows: min-content 1fr;
    grid-gap: ${(props) => (props.lesevisning ? 0.5 : 1)}rem;
    align-items: center;
`;

export interface IVedtaksperiodeData {
    vedtaksperiodeListe: IVedtaksperiode[];
    periodeBegrunnelse: string;
}

interface Props {
    vedtaksperiodeData: IVedtaksperiodeData;
    settVedtaksperiodeData: (verdi: IVedtaksperiodeData) => void;
    valideringsfeil?: IValideringsfeil['vedtak'];
}

export const tomVedtaksperiodeRad: IVedtaksperiode = {
    periodeType: '' as EPeriodetype,
    aktivitet: '' as EAktivitet,
};

const VedtaksperiodeValg: React.FC<Props> = ({ vedtaksperiodeData, settVedtaksperiodeData }) => {
    const { behandlingErRedigerbar } = useBehandling();

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
            {vedtaksperiodeData.vedtaksperiodeListe.map((vedtaksperiode, index) => {
                const { periodeType, aktivitet, årMånedFra, årMånedTil } = vedtaksperiode;
                return (
                    <VedtakContainer className={'blokk-s'} lesevisning={!behandlingErRedigerbar}>
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
                            aktivitetfeil={null}
                        />
                        <MånedÅrPeriode
                            datoFraTekst={index === 0 ? 'Fra og med' : undefined}
                            datoTilTekst={index === 0 ? 'Til og med' : undefined}
                            årMånedFraInitiell={årMånedFra}
                            årMånedTilInitiell={årMånedTil}
                            onEndre={(verdi, periodeVariant) => {
                                oppdaterVedtakslisteElement(
                                    index,
                                    periodeVariantTilProperty(periodeVariant),
                                    verdi
                                );
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                        />

                        {behandlingErRedigerbar &&
                            index === vedtaksperiodeData.vedtaksperiodeListe.length - 1 &&
                            index !== 0 && (
                                <FjernKnapp
                                    onClick={fjernVedtaksperiode}
                                    knappetekst="Fjern vedtaksperiode"
                                />
                            )}
                    </VedtakContainer>
                );
            })}
            <LeggTilKnapp
                onClick={leggTilVedtaksperiode}
                knappetekst="Legg til vedtaksperiode"
                hidden={!behandlingErRedigerbar}
            />
        </section>
    );
};

export default VedtaksperiodeValg;
