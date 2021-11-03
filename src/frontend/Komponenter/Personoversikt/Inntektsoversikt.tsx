import React, { useMemo } from 'react';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import styled from 'styled-components';
import { formaterMånedÅrTilIsoFormat, formaterÅrMåned } from '../../App/utils/formatter';
import { addMonths } from 'date-fns';
import { toTitleCase } from '../../App/utils/utils';
import { v4 as uuidv4 } from 'uuid';

interface AMeldingInntekt {
    inntektPerVirksomhet: InntektForVirksomhet[];
    avvik: string[];
}

interface InntektForVirksomhet {
    identifikator: string;
    navn: string;
    inntektPerMåned: Record<string, InntektPerMåned>;
}

interface InntektPerMåned {
    totalbeløp: number;
    inntekt: Inntekt[];
}

interface Inntekt {
    beløp: number;
    beskrivelse?: string;
    fordel: FordelType;
    type: InntektType;
    kategori?: string;
    opptjeningsland?: string;
    opptjeningsperiodeFom?: string;
    opptjeningsperiodeTom?: string;
}

enum InntektType {
    LØNNSINNTEKT = 'LØNNSINNTEKT',
    NÆRINGSINNTEKT = 'NÆRINGSINNTEKT',
    PENSJON_ELLER_TRYGD = 'PENSJON_ELLER_TRYGD',
    YTELSE_FRA_OFFENTLIGE = 'YTELSE_FRA_OFFENTLIGE',
}

enum FordelType {
    KONTANTYTELSE = 'KONTANTYTELSE',
    NATURALYTELSE = 'NATURALYTELSE',
    UTGIFTSGODTGJØRELSE = 'UTGIFTSGODTGJØRELSE',
}

const fordelTypeTilString: Record<FordelType, string> = {
    KONTANTYTELSE: 'Kontantytelse',
    NATURALYTELSE: 'Naturalytelse',
    UTGIFTSGODTGJØRELSE: 'Utgiftsgodtgjørelse',
};

const StyledTabell = styled.table`
    margin-top: 2rem;
`;

const grupperTotalBeløpPerMåned = (inntekt: AMeldingInntekt): Record<string, number> =>
    inntekt.inntektPerVirksomhet.reduce((acc, inntektForVirksomhet) => {
        Object.entries(inntektForVirksomhet.inntektPerMåned).forEach(
            ([årMåned, inntektPerMåned]) =>
                (acc[årMåned] = (acc[årMåned] || 0) + inntektPerMåned.totalbeløp)
        );
        return acc;
    }, {} as Record<string, number>);

function lagMånederSomSkalVises() {
    const date = new Date(); // setter dagens år/måned
    date.setDate(1);

    return [addMonths(date, -2), addMonths(date, -1), date];
}

const InntektTabell: React.FC<{ inntekt: AMeldingInntekt }> = ({ inntekt }) => {
    const måneder = lagMånederSomSkalVises();
    const totalBeløpPerMåned = grupperTotalBeløpPerMåned(inntekt);

    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Virksomhet</th>
                    {måneder.map((måned) => (
                        <th key={uuidv4()}>{toTitleCase(formaterÅrMåned(måned))}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {inntekt.inntektPerVirksomhet.map((inntekt) =>
                    inntektForVirksomhetRad(inntekt, måneder)
                )}
                <tr>
                    <td>Totalbeløp</td>
                    {måneder.map((måned) => (
                        <td key={uuidv4()}>
                            {totalBeløpPerMåned[formaterMånedÅrTilIsoFormat(måned)] || 0}
                        </td>
                    ))}
                </tr>
            </tbody>
        </StyledTabell>
    );
};

const renderInntektPerFordel = (type: FordelType, inntekter?: Inntekt[]) => {
    if (!inntekter) {
        return null;
    }
    return (
        <>
            <div style={{ fontWeight: 'bold' }}>{fordelTypeTilString[type]}</div>
            {inntekter.map((inntekt) => (
                <div
                    key={uuidv4()}
                >{`${inntekt.beløp} - ${inntekt.beskrivelse} (${inntekt.opptjeningsland}) - ${inntekt.kategori}`}</div>
            ))}
        </>
    );
};

const inntektPerMåned = (inntektPerMåned?: InntektPerMåned) => {
    if (!inntektPerMåned) {
        return null;
    }
    const inntektPerFordel = inntektPerMåned.inntekt.reduce((acc, inntekt) => {
        const accElement = acc[inntekt.fordel] || [];
        accElement.push(inntekt);
        acc[inntekt.fordel] = accElement;
        return acc;
    }, {} as Record<FordelType, Inntekt[]>);
    return (
        <>
            <div>Total lønnsinntekt: {inntektPerMåned.totalbeløp}</div>
            <div>Inntekter:</div>
            <div>
                {Object.keys(FordelType)
                    .map((i) => i as FordelType)
                    .map((inntektType) =>
                        renderInntektPerFordel(inntektType, inntektPerFordel[inntektType])
                    )}
            </div>
        </>
    );
};

const inntektForVirksomhetRad = (inntekt: InntektForVirksomhet, måneder: Date[]) => (
    <tr key={uuidv4()}>
        <td>
            {inntekt.navn} ({inntekt.identifikator})
        </td>
        {måneder.map((måned) => (
            <td>{inntektPerMåned(inntekt.inntektPerMåned[formaterMånedÅrTilIsoFormat(måned)])}</td>
        ))}
    </tr>
);

const Inntektsoversikt: React.FC<{ fagsakId: string }> = ({ fagsakId }) => {
    const inntektRequestConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/inntekt/fagsak/${fagsakId}`,
        }),
        [fagsakId]
    );

    const inntekt = useDataHenter<AMeldingInntekt, null>(inntektRequestConfig);

    return (
        <DataViewer response={{ inntekt }}>
            {({ inntekt }) => (
                <>
                    <span style={{ fontWeight: 'bold', fontSize: '24px', color: 'red' }}>
                        Under utvikling
                    </span>
                    <InntektTabell inntekt={inntekt} />
                </>
            )}
        </DataViewer>
    );
};

export default Inntektsoversikt;
