import { InfotrygdPeriodeMedFlereEndringer } from '../Infotrygd/typer';
import {
    formaterNullableIsoDato,
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../App/utils/formatter';
import {
    aktivitetstypeTilKode,
    aktivitetstypeTilTekst,
    InfotrygdPeriode,
    infotrygdperioder,
    Kode,
    kodeTilForkortetTekst,
    kodeTilTekst,
    overgangsstønadKodeTilForkortetTekst,
    overgangsstønadKodeTilTekst,
    sakstypeTilKode,
    sakstypeTilTekst,
} from '../../App/typer/infotrygd';
import React from 'react';
import { slåSammenOgSorterPerioder } from '../Infotrygd/grupperInfotrygdperiode';
import styled from 'styled-components';
import { Stønadstype } from '../../App/typer/behandlingstema';
import { Table, Tooltip } from '@navikt/ds-react';
import { useWindowSize } from '../../App/hooks/felles/useWindowSize';

/**
 * Tabellene har alle 10 kolonner for å få samme kolonner på samme sted i tabellene
 * 6*8 + 10 + 10 + 2*16 = 100
 */
const StyledTabell = styled.table`
    th {
        width: 8%;
    }
    // datoer trenger litt ekstra då de iblant viser opphørsdato
    th:nth-child(1) {
        width: 9%;
    }
    // sakstype
    th:nth-child(7) {
        width: 10%;
    }
    // aktivitet / Periodetype
    th:nth-child(8),
    th:nth-child(9) {
        width: 16%;
    }
`;

const Rad = styled.tr``;

const TabellTekst = styled.p`
    margin: 0rem;
`;

const TabellBeløp = styled.p`
    margin: 0rem;
    text-align: right;
`;

const HøyrestiltHeader = styled.p`
    margin: 0rem;
    text-align: right;
`;

const formatStønadTom = (periode: InfotrygdPeriodeMedFlereEndringer): string => {
    const stønadTom = formaterNullableMånedÅr(periode.stønadTom) as string;
    if (periode.kode === Kode.OPPHØRT || periode.kode === Kode.OVERTFØRT_NY_LØSNING) {
        return `${formaterNullableMånedÅr(periode.opphørsdato)} (${stønadTom})`;
    } else {
        return stønadTom;
    }
};

const SpaceMaker = styled.div`
    margin-top: 2rem;
    margin-bottom: 2rem;
`;

const InfotrygdPerioderOvergangsstønad: React.FC<{
    perioder: InfotrygdPeriodeMedFlereEndringer[];
}> = ({ perioder }) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>
                        Periode <br />
                        (fom-tom)
                    </th>
                    <th>Månedsbeløp</th>
                    <th>Inntektsgrunnlag</th>
                    <th>Samordningsfradrag</th>
                    <th>Vedtakstidspunkt</th>
                    <th>Kode</th>
                    <th>Sakstype</th>
                    <th>Aktivitet</th>
                    <th>Periodetype</th>
                    <th>Saksbehandler</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad key={`${periode.stønadId}-${periode.vedtakId}`}>
                        <td>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formatStønadTom(periode)}
                        </td>
                        <td>{formaterTallMedTusenSkille(periode.månedsbeløp)}</td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsgrunnlag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.samordningsfradrag)}</td>
                        <td>{formaterNullableIsoDato(periode.vedtakstidspunkt)}</td>
                        <td>
                            {kodeTilTekst[periode.kode]}{' '}
                            {periode.initiellKode && `(${kodeTilTekst[periode.initiellKode]})`}
                        </td>
                        <td>{sakstypeTilTekst[periode.sakstype]}</td>
                        <td>
                            {periode.aktivitetstype &&
                                aktivitetstypeTilTekst[periode.aktivitetstype]}
                        </td>
                        <td>
                            {periode.kodeOvergangsstønad &&
                                overgangsstønadKodeTilTekst[periode.kodeOvergangsstønad]}
                        </td>
                        <td>{periode.brukerId}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const utledTabellHeader = (width: number, stønadstype: Stønadstype) => {
    return width >= 1370 ? (
        <Table.Row>
            <Table.HeaderCell scope="col">Periode (fom-tom)</Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltHeader>Månedsbeløp</HøyrestiltHeader>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltHeader>Inntektsgrunnlag</HøyrestiltHeader>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltHeader>Samordningsfradrag</HøyrestiltHeader>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">Vedtakstidspunkt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sakstype</Table.HeaderCell>
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
            )}
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <Table.HeaderCell scope="col">Periodetype</Table.HeaderCell>
            )}
            <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
        </Table.Row>
    ) : (
        <Table.Row>
            <Table.HeaderCell scope="col">
                Periode <br /> (fom-tom)
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltHeader>
                    Måned- <br /> beløp
                </HøyrestiltHeader>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltHeader>
                    Inntekt- <br /> grunnlag
                </HøyrestiltHeader>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltHeader>
                    Samordning- <br /> fradrag
                </HøyrestiltHeader>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                Vedtak- <br /> tidspunkt
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">Kode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sakstype</Table.HeaderCell>
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
            )}
            {stønadstype === Stønadstype.OVERGANGSSTØNAD && (
                <Table.HeaderCell scope="col">Periodetype</Table.HeaderCell>
            )}
            <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
        </Table.Row>
    );
};

const InfotrygdPerioderOvergangsstønadKompakt: React.FC<{
    perioder: InfotrygdPeriodeMedFlereEndringer[];
}> = ({ perioder }) => {
    const { width } = useWindowSize();
    return (
        <Table zebraStripes={true} size={'small'}>
            <Table.Header>{utledTabellHeader(width, Stønadstype.OVERGANGSSTØNAD)}</Table.Header>
            <Table.Body>
                {perioder.map((periode) => (
                    <Table.Row key={`${periode.stønadId}-${periode.vedtakId}`}>
                        <Table.DataCell>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formatStønadTom(periode)}
                        </Table.DataCell>
                        <Table.DataCell>
                            <TabellBeløp>
                                {formaterTallMedTusenSkille(periode.månedsbeløp)}
                            </TabellBeløp>
                        </Table.DataCell>
                        <Table.DataCell>
                            <TabellBeløp>
                                {formaterTallMedTusenSkille(periode.inntektsgrunnlag)}
                            </TabellBeløp>
                        </Table.DataCell>
                        <Table.DataCell>
                            <TabellBeløp>
                                {formaterTallMedTusenSkille(periode.samordningsfradrag)}
                            </TabellBeløp>
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterNullableIsoDato(periode.vedtakstidspunkt)}
                        </Table.DataCell>
                        <Table.DataCell>
                            <Tooltip
                                content={kodeTilTekst[periode.kode]}
                                placement="right"
                                maxChar={200}
                            >
                                <TabellTekst>
                                    {kodeTilForkortetTekst[periode.kode]}{' '}
                                    {periode.initiellKode &&
                                        `(${kodeTilForkortetTekst[periode.initiellKode]})`}
                                </TabellTekst>
                            </Tooltip>
                        </Table.DataCell>
                        <Table.DataCell>
                            <Tooltip
                                content={sakstypeTilTekst[periode.sakstype]}
                                placement="right"
                                maxChar={200}
                            >
                                <TabellTekst>{sakstypeTilKode[periode.sakstype]}</TabellTekst>
                            </Tooltip>
                        </Table.DataCell>
                        <Table.DataCell>
                            {periode.aktivitetstype && (
                                <Tooltip
                                    content={aktivitetstypeTilTekst[periode.aktivitetstype]}
                                    placement="right"
                                    maxChar={200}
                                >
                                    <TabellTekst>
                                        {periode.aktivitetstype &&
                                            aktivitetstypeTilKode[periode.aktivitetstype]}
                                    </TabellTekst>
                                </Tooltip>
                            )}
                        </Table.DataCell>
                        <Table.DataCell>
                            {periode.kodeOvergangsstønad && (
                                <Tooltip
                                    content={
                                        overgangsstønadKodeTilTekst[periode.kodeOvergangsstønad]
                                    }
                                    placement="right"
                                    maxChar={200}
                                >
                                    <TabellTekst>
                                        {
                                            overgangsstønadKodeTilForkortetTekst[
                                                periode.kodeOvergangsstønad
                                            ]
                                        }
                                    </TabellTekst>
                                </Tooltip>
                            )}
                        </Table.DataCell>
                        <Table.DataCell>{periode.brukerId}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

const InfotrygdPerioderBarnetilsyn: React.FC<{ perioder: InfotrygdPeriodeMedFlereEndringer[] }> = ({
    perioder,
}) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    <th>Månedsbeløp</th>
                    <th>Inntektsgrunnlag</th>
                    <th>Utgifter barnetilsyn</th>
                    <th>Vedtakstidspunkt</th>
                    <th>Kode</th>
                    <th>Sakstype</th>
                    <th></th>
                    <th></th>
                    <th>Saksbehandler</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad key={`${periode.stønadId}-${periode.vedtakId}`}>
                        <td>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formatStønadTom(periode)}
                        </td>
                        <td>{formaterTallMedTusenSkille(periode.månedsbeløp)}</td>
                        <td>{formaterTallMedTusenSkille(periode.inntektsgrunnlag)}</td>
                        <td>{formaterTallMedTusenSkille(periode.utgifterBarnetilsyn)}</td>
                        <td>{formaterNullableIsoDato(periode.vedtakstidspunkt)}</td>
                        <td>
                            {kodeTilTekst[periode.kode]}{' '}
                            {periode.initiellKode && `(${kodeTilTekst[periode.initiellKode]})`}
                        </td>
                        <td>{sakstypeTilTekst[periode.sakstype]}</td>
                        <td></td>
                        <td></td>
                        <td>{periode.brukerId}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const InfotrygdPerioderBarnetilsynKompakt: React.FC<{
    perioder: InfotrygdPeriodeMedFlereEndringer[];
}> = ({ perioder }) => {
    const { width } = useWindowSize();
    return (
        <Table zebraStripes={true} size={'small'}>
            <Table.Header>{utledTabellHeader(width, Stønadstype.BARNETILSYN)}</Table.Header>
            <Table.Body>
                {perioder.map((periode) => (
                    <Table.Row key={`${periode.stønadId}-${periode.vedtakId}`}>
                        <Table.DataCell>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formatStønadTom(periode)}
                        </Table.DataCell>
                        <Table.DataCell>
                            <TabellBeløp>
                                {formaterTallMedTusenSkille(periode.månedsbeløp)}
                            </TabellBeløp>
                        </Table.DataCell>
                        <Table.DataCell>
                            <TabellBeløp>
                                {formaterTallMedTusenSkille(periode.inntektsgrunnlag)}
                            </TabellBeløp>
                        </Table.DataCell>
                        <Table.DataCell>
                            <TabellBeløp>
                                {formaterTallMedTusenSkille(periode.utgifterBarnetilsyn)}
                            </TabellBeløp>
                        </Table.DataCell>
                        <Table.DataCell>
                            {formaterNullableIsoDato(periode.vedtakstidspunkt)}
                        </Table.DataCell>
                        <Table.DataCell>
                            <Tooltip
                                content={kodeTilTekst[periode.kode]}
                                placement="right"
                                maxChar={200}
                            >
                                <TabellTekst>
                                    {kodeTilForkortetTekst[periode.kode]}{' '}
                                    {periode.initiellKode &&
                                        `(${kodeTilForkortetTekst[periode.initiellKode]})`}
                                </TabellTekst>
                            </Tooltip>
                        </Table.DataCell>
                        <Table.DataCell>
                            <Tooltip
                                content={sakstypeTilTekst[periode.sakstype]}
                                placement="right"
                                maxChar={200}
                            >
                                <TabellTekst>{sakstypeTilKode[periode.sakstype]}</TabellTekst>
                            </Tooltip>
                        </Table.DataCell>
                        <Table.DataCell>{periode.brukerId}</Table.DataCell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

// <Rad key={`${periode.stønadId}-${periode.vedtakId}`}>
//     <td>
//         {formaterNullableMånedÅr(periode.stønadFom)}
//         {' - '}
//         {formatStønadTom(periode)}
//     </td>
//     <td>{formaterTallMedTusenSkille(periode.månedsbeløp)}</td>
//     <td>{formaterTallMedTusenSkille(periode.inntektsgrunnlag)}</td>
//     <td>{formaterTallMedTusenSkille(periode.utgifterBarnetilsyn)}</td>
//     <td>{formaterNullableIsoDato(periode.vedtakstidspunkt)}</td>
//     <td>
//         {kodeTilTekst[periode.kode]}{' '}
//         {periode.initiellKode && `(${kodeTilTekst[periode.initiellKode]})`}
//     </td>
//     <td>{sakstypeTilTekst[periode.sakstype]}</td>
//     <td></td>
//     <td></td>
//     <td>{periode.brukerId}</td>
// </Rad>;

const InfotrygdPerioderSkolepenger: React.FC<{ perioder: InfotrygdPeriodeMedFlereEndringer[] }> = ({
    perioder,
}) => {
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Periode (fom-tom)</th>
                    <th>Månedsbeløp</th>
                    <th>Engangsbeløp</th>
                    <th></th>
                    <th>Vedtakstidspunkt</th>
                    <th>Kode</th>
                    <th>Sakstype</th>
                    <th></th>
                    <th></th>
                    <th>Saksbehandler</th>
                </tr>
            </thead>
            <tbody>
                {perioder.map((periode) => (
                    <Rad key={`${periode.stønadId}-${periode.vedtakId}`}>
                        <td>
                            {formaterNullableMånedÅr(periode.stønadFom)}
                            {' - '}
                            {formatStønadTom(periode)}
                        </td>
                        <td>{formaterTallMedTusenSkille(periode.månedsbeløp)}</td>
                        <td>{formaterTallMedTusenSkille(periode.engangsbeløp)}</td>
                        <td></td>
                        <td>{formaterNullableIsoDato(periode.vedtakstidspunkt)}</td>
                        <td>
                            {kodeTilTekst[periode.kode]}{' '}
                            {periode.initiellKode && `(${kodeTilTekst[periode.initiellKode]})`}
                        </td>
                        <td>{sakstypeTilTekst[periode.sakstype]}</td>
                        <td></td>
                        <td></td>
                        <td>{periode.brukerId}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

const InfotrygdPerioder: React.FC<{ stønadstype: Stønadstype; perioder: InfotrygdPeriode[] }> = ({
    stønadstype,
    perioder,
}) => {
    if (perioder.length === 0) {
        return <>Ingen vedtaksperioder i Infotrygd</>;
    }
    const sammenslåttePerioder = slåSammenOgSorterPerioder(perioder);
    switch (stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return (
                <>
                    <InfotrygdPerioderOvergangsstønad perioder={infotrygdperioder} />
                    <SpaceMaker />
                    <InfotrygdPerioderOvergangsstønadKompakt perioder={infotrygdperioder} />
                </>
            );
        case Stønadstype.BARNETILSYN:
            return (
                <>
                    <InfotrygdPerioderBarnetilsynKompakt perioder={infotrygdperioder} />

                    <InfotrygdPerioderBarnetilsyn perioder={infotrygdperioder} />
                </>
            );
        case Stønadstype.SKOLEPENGER:
            return <InfotrygdPerioderSkolepenger perioder={sammenslåttePerioder} />;
    }
};

export default InfotrygdPerioder;
