import { Element } from 'nav-frontend-typografi';
import {
    EPeriodeProperty,
    EPeriodetype,
    IVedtaksperiode,
    periodeVariantTilProperty,
} from '../../../typer/vedtak';
import AktivitetspliktVelger from './AktivitetspliktVelger';
import MånedÅrPeriode, { PeriodeVariant } from '../../Felleskomponenter/MånedÅr/MånedÅrPeriode';
import { AddCircle, Delete } from '@navikt/ds-icons';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Select, Textarea } from 'nav-frontend-skjema';
import { Flatknapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { månederMellom, månedÅrTilDate } from '../../../utils/dato';

const VedtaksperiodeRad = styled.div`
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

const StyledSelect = styled(Select)`
    max-width: 200px;
    margin-right: 2rem;
`;

const MndKnappWrapper = styled.div`
    width: 90px;
    display: flex;
`;

interface Props {
    vedtaksperiodeListe: IVedtaksperiode[];
    periodeBegrunnelse: string;

    oppdaterVedtakslisteElement: (
        index: number,
        periodeType: EPeriodeProperty,
        verdi: string | undefined
    ) => void;
    fjernVedtaksperiode: () => void;
    valideringsfeil: string[];
    leggTilVedtaksperiode: () => void;
    settPeriodeBegrunnelse: (verdi: string) => void;
}

const kalkulerAntallMåneder = (årMånedFra?: string, årMånedTil?: string): number | undefined => {
    if (årMånedFra && årMånedTil) {
        return månederMellom(månedÅrTilDate(årMånedFra), månedÅrTilDate(årMånedTil));
    }
    return undefined;
};

const VedtaksperiodeValg: React.FC<Props> = ({
    vedtaksperiodeListe,
    oppdaterVedtakslisteElement,
    fjernVedtaksperiode,
    valideringsfeil,
    leggTilVedtaksperiode,
    periodeBegrunnelse,
    settPeriodeBegrunnelse,
}) => {
    return (
        <>
            <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>Vedtaksperiode</Element>
            {vedtaksperiodeListe.map((element, index) => {
                const { periodeType, aktivitet, årMånedFra, årMånedTil } = element;
                const antallMåneder = kalkulerAntallMåneder(årMånedFra, årMånedTil);

                return (
                    <VedtaksperiodeRad key={index}>
                        <StyledSelect
                            label={index === 0 && 'Periodetype'}
                            value={periodeType}
                            onChange={(e) => {
                                oppdaterVedtakslisteElement(
                                    index,
                                    EPeriodeProperty.periodeType,
                                    e.target.value
                                );
                            }}
                        >
                            <option value="">Velg</option>
                            <option value={EPeriodetype.PERIODE_FØR_FØDSEL}>
                                Periode før fødsel
                            </option>
                            <option value={EPeriodetype.HOVEDPERIODE}>Hovedperiode</option>
                        </StyledSelect>
                        <AktivitetspliktVelger
                            index={index}
                            aktivitet={aktivitet}
                            periodeType={periodeType}
                            oppdaterVedtakslisteElement={oppdaterVedtakslisteElement}
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
                        />

                        <MndKnappWrapper>
                            <Element style={{ marginTop: index === 0 ? '2.5rem' : '1rem' }}>
                                {!!antallMåneder && `${antallMåneder} mnd`}
                            </Element>
                            {index === vedtaksperiodeListe.length - 1 && index !== 0 && (
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
            <KnappMedLuftUnder onClick={leggTilVedtaksperiode}>
                <AddCircle style={{ marginRight: '1rem' }} />
                Legg til vedtaksperiode
            </KnappMedLuftUnder>
            <Textarea
                value={periodeBegrunnelse}
                onChange={(e) => {
                    settPeriodeBegrunnelse(e.target.value);
                }}
                label="Begrunnelse"
            />
        </>
    );
};

export default VedtaksperiodeValg;
