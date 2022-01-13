import React, { useMemo, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import 'nav-frontend-tabell-style';
import styled from 'styled-components';
import {
    formaterNullableIsoDato,
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../App/utils/formatter';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Checkbox } from 'nav-frontend-skjema';

const StyledTabell = styled.table`
    max-width: 80%;
    margin-top: 2rem;
`;

const Rad = styled.tr``;

interface InfotrygdPerioderResponse {
    overgangsstønad: Perioder;
    barnetilsyn: Perioder;
    skolepenger: Perioder;
}

interface Perioder {
    perioder: InfotrygdPeriode[];
    summert: SummertPeriode[];
}

interface SummertPeriode {
    stønadFom: string;
    stønadTom: string;
    beløp: number;
    inntektsreduksjon: number;
    samordningsfradrag: number;
}

interface InfotrygdPeriode {
    vedtakId: number;
    vedtakstidspunkt: string;

    stønadFom: string;
    stønadTom: string;
    opphørsdato?: string;

    beløp: number;
    inntektsgrunnlag: number;
    samordningsfradrag: number;

    kode: Kode;
    sakstype: Sakstype;
    brukerId: string;
}

enum Kode {
    ANNULERT = 'ANNULERT',
    ENDRING_BEREGNINGSGRUNNLAG = 'ENDRING_BEREGNINGSGRUNNLAG',
    FØRSTEGANGSVEDTAK = 'FØRSTEGANGSVEDTAK',
    G_REGULERING = 'G_REGULERING',
    NY = 'NY',
    OPPHØRT = 'OPPHØRT',
    SATSENDRING = 'SATSENDRING',
    UAKTUELL = 'UAKTUELL',
    OVERTFØRT_NY_LØSNING = 'OVERTFØRT_NY_LØSNING',
}

const kodeTilTekst: Record<Kode, string> = {
    ANNULERT: 'Annullert (AN)',
    ENDRING_BEREGNINGSGRUNNLAG: 'Endring i beregningsgrunnlag (E)',
    FØRSTEGANGSVEDTAK: 'Førstegangsvedtak (F)',
    G_REGULERING: 'G-regulering (G)',
    NY: 'Ny (NY)',
    OPPHØRT: 'Opphørt (O)',
    SATSENDRING: 'Satsendring (S)',
    UAKTUELL: 'Uaktuell (UA)',
    OVERTFØRT_NY_LØSNING: 'Overf ny løsning (OO)',
};

enum Sakstype {
    KLAGE = 'KLAGE',
    MASKINELL_G_OMREGNING = 'MASKINELL_G_OMREGNING',
    REVURDERING = 'REVURDERING',
    GRUNNBELØP_OMREGNING = 'GRUNNBELØP_OMREGNING',
    KONVERTERING = 'KONVERTERING',
    MASKINELL_SATSOMREGNING = 'MASKINELL_SATSOMREGNING',
    ANKE = 'ANKE',
    SØKNAD = 'SØKNAD',
    SØKNAD_ØKNING_ENDRING = 'SØKNAD_ØKNING_ENDRING',
}

const sakstypeTilTekst: Record<Sakstype, string> = {
    KLAGE: 'Klage (K)',
    MASKINELL_G_OMREGNING: 'Maskinell G-omregning (MG)',
    REVURDERING: 'Revurdering (R)',
    GRUNNBELØP_OMREGNING: 'Grunnbeløp omregning (GO)',
    KONVERTERING: 'Konvertering (KO)',
    MASKINELL_SATSOMREGNING: 'Maskinell satsomregning (MS)',
    ANKE: 'Anke (A)',
    SØKNAD: 'Søknad (S)',
    SØKNAD_ØKNING_ENDRING: 'Søknad om økning/endring (SØ)',
};

const SummertePerioder: React.FC<{ perioder: SummertPeriode[] }> = ({ perioder }) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    <th>Inntektsgrunnlag</th>
                    <th>Samordningsfradrag</th>
                    <th>Stønadsbeløp</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad>
                        <td>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formaterNullableMånedÅr(periode.stønadTom)}
                        </td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsreduksjon)}</td>
                        <td>{formaterTallMedTusenSkille(periode.samordningsfradrag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.beløp)}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const InfotrygdPerioder: React.FC<{ perioder: InfotrygdPeriode[] }> = ({ perioder }) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>VedtakId</th>
                    <th>Periode (fom-tom)</th>
                    <th>Opphørsdato</th>
                    <th>Inntektsgrunnlag</th>
                    <th>Samordningsfradrag</th>
                    <th>Stønadsbeløp</th>
                    <th>Vedtakstidspunkt</th>
                    <th>Kode</th>
                    <th>Sakstype</th>
                    <th>Saksbehandler</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad>
                        <td>{periode.vedtakId}</td>
                        <td>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formaterNullableMånedÅr(periode.stønadTom)}
                        </td>
                        <td>{formaterNullableMånedÅr(periode.opphørsdato)}</td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsgrunnlag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.samordningsfradrag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.beløp)}</td>
                        <td>{formaterNullableIsoDato(periode.vedtakstidspunkt)}</td>
                        <td>{kodeTilTekst[periode.kode]}</td>
                        <td>{sakstypeTilTekst[periode.sakstype]}</td>
                        <td>{periode.brukerId}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const InfotrygdEllerSummertePerioder: React.FC<{ perioder: InfotrygdPerioderResponse }> = ({
    perioder,
}) => {
    const [visSummert, settVisSummert] = useState<boolean>(false);

    const visPerioder = (visSummert: boolean, perioder: Perioder) => {
        return visSummert ? (
            <SummertePerioder perioder={perioder.summert} />
        ) : (
            <InfotrygdPerioder perioder={perioder.perioder} />
        );
    };

    return (
        <>
            <Checkbox
                label={'Vis summerte perioder'}
                onClick={() => {
                    settVisSummert((prevState) => !prevState);
                }}
                checked={visSummert}
            />
            <h1>Overgangsstønad</h1>
            {visPerioder(visSummert, perioder.overgangsstønad)}

            <h1>Barnetilsyn</h1>
            {visPerioder(visSummert, perioder.barnetilsyn)}

            <h1>Skolepenger</h1>
            {visPerioder(visSummert, perioder.skolepenger)}
        </>
    );
};

const Infotrygdperioderoversikt: React.FC<{
    personIdent: string;
}> = ({ personIdent }) => {
    const infotrygdPerioderConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/infotrygd/perioder`,
            data: {
                personIdent,
            },
        }),
        [personIdent]
    );
    const infotrygdPerioder = useDataHenter<InfotrygdPerioderResponse, null>(
        infotrygdPerioderConfig
    );
    return (
        <DataViewer response={{ infotrygdPerioder }}>
            {({ infotrygdPerioder }) => {
                return <InfotrygdEllerSummertePerioder perioder={infotrygdPerioder} />;
            }}
        </DataViewer>
    );
};

export default Infotrygdperioderoversikt;
