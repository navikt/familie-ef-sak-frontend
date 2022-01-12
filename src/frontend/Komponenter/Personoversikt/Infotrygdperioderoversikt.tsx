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
    stønadId: number;
    vedtakId: number;

    stønadFom: string;
    stønadTom: string;
    opphørsdato?: string;

    beløp: number;
    inntektsreduksjon: number;
    samordningsfradrag: number;

    startDato: string;
    kode: string;
    brukerId: string;
}

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
                    <th>StønadId</th>
                    <th>VedtakId</th>
                    <th>Periode (fom-tom)</th>
                    <th>Opphørsdato</th>
                    <th>Inntektsreduskjon</th>
                    <th>Samordningsfradrag</th>
                    <th>Stønadsbeløp</th>
                    <th>Startdato</th>
                    <th>Kode</th>
                    <th>Saksbehandler</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad>
                        <td>{periode.stønadId}</td>
                        <td>{periode.vedtakId}</td>
                        <td>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formaterNullableMånedÅr(periode.stønadTom)}
                        </td>
                        <td>{formaterNullableMånedÅr(periode.opphørsdato)}</td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsreduksjon)}</td>
                        <td>{formaterTallMedTusenSkille(periode.samordningsfradrag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.beløp)}</td>
                        <td>{formaterNullableIsoDato(periode.startDato)}</td>
                        <td>{periode.kode}</td>
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
