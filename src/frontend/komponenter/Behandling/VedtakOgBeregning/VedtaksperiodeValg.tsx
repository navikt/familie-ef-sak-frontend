import { Element } from 'nav-frontend-typografi';
import {
    EAktivitet,
    EPeriodeProperty,
    EPeriodetype,
    periodetypeTilTekst,
    IVedtaksperiode,
    periodeVariantTilProperty,
} from '../../../typer/vedtak';
import AktivitetspliktVelger from './AktivitetspliktVelger';
import MånedÅrPeriode, { PeriodeVariant } from '../../Felleskomponenter/MånedÅr/MånedÅrPeriode';
import { AddCircle, Delete } from '@navikt/ds-icons';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Flatknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { månederMellom, månedÅrTilDate } from '../../../utils/dato';
import { useBehandling } from '../../../context/BehandlingContext';
import { FamilieSelect, FamilieTextarea } from '@navikt/familie-form-elements';

const VedtaksperiodeRad = styled.div`
    display: flex;
    align-items: center;
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

const StyledSelect = styled(FamilieSelect)`
    //min-width: 140px;
    max-width: 200px;
    margin-right: 2rem;
`;

const MndKnappWrapper = styled.div`
    width: 90px;
    display: flex;
    align-items: center;
`;

export interface IVedtaksperiodeData {
    vedtaksperiodeListe: IVedtaksperiode[];
    periodeBegrunnelse: string;
}

interface Props {
    vedtaksperiodeData: IVedtaksperiodeData;
    settVedtaksperiodeData: (verdi: IVedtaksperiodeData) => void;
    valideringsfeil: string[];
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
    valideringsfeil,
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
            return i === index ? { ...vedtaksperiode, [property]: value } : vedtaksperiode;
        });
        settVedtaksperiodeData({
            ...vedtaksperiodeData,
            vedtaksperiodeListe: oppdatertListe,
        });
    };

    return (
        <>
            <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>Vedtaksperiode</Element>
            {vedtaksperiodeData.vedtaksperiodeListe.map((element, index) => {
                const { periodeType, aktivitet, årMånedFra, årMånedTil } = element;
                const antallMåneder = kalkulerAntallMåneder(årMånedFra, årMånedTil);

                return (
                    <VedtaksperiodeRad key={index}>
                        <StyledSelect
                            label={index === 0 && 'Periodetype'}
                            aria-label={index !== 0 ? 'Periodetype' : ''}
                            value={periodeType}
                            onChange={(e) => {
                                oppdaterVedtakslisteElement(
                                    index,
                                    EPeriodeProperty.periodeType,
                                    e.target.value
                                );
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                            lesevisningVerdi={periodetypeTilTekst[periodeType]}
                        >
                            <option value="">Velg</option>
                            <option value={EPeriodetype.PERIODE_FØR_FØDSEL}>
                                {periodetypeTilTekst[EPeriodetype.PERIODE_FØR_FØDSEL]}
                            </option>
                            <option value={EPeriodetype.HOVEDPERIODE}>
                                {periodetypeTilTekst[EPeriodetype.HOVEDPERIODE]}
                            </option>
                        </StyledSelect>
                        <AktivitetspliktVelger
                            index={index}
                            aktivitet={aktivitet}
                            periodeType={periodeType}
                            oppdaterVedtakslisteElement={oppdaterVedtakslisteElement}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <MånedÅrPeriode
                            datoFraTekst={index === 0 ? 'Fra og med' : ''}
                            datoTilTekst={index === 0 ? 'Til og med' : ''}
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
                    </VedtaksperiodeRad>
                );
            })}
            {valideringsfeil.map((feil) => (
                <AlertStripeFeil>{feil}</AlertStripeFeil>
            ))}
            {behandlingErRedigerbar && (
                <KnappMedLuftUnder onClick={leggTilVedtaksperiode}>
                    <AddCircle style={{ marginRight: '1rem' }} />
                    Legg til vedtaksperiode
                </KnappMedLuftUnder>
            )}
            <FamilieTextarea
                value={vedtaksperiodeData.periodeBegrunnelse}
                onChange={(e) => {
                    settPeriodeBegrunnelse(e.target.value);
                }}
                label="Begrunnelse"
                maxLength={0}
                erLesevisning={!behandlingErRedigerbar}
            />
        </>
    );
};

export default VedtaksperiodeValg;
