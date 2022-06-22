import React from 'react';
import { InfotrygdPeriodeMedFlereEndringer } from '../Infotrygd/typer';
import {
    formaterNullableIsoDato,
    formaterNullableMånedÅr,
    formaterTallMedTusenSkille,
} from '../../App/utils/formatter';
import {
    aktivitetstypeTilKode,
    aktivitetstypeTilTekst,
    Kode,
    kodeTilForkortetTekst,
    kodeTilTekst,
    overgangsstønadKodeTilForkortetTekst,
    overgangsstønadKodeTilTekst,
    sakstypeTilKode,
    sakstypeTilTekst,
} from '../../App/typer/infotrygd';
import styled from 'styled-components';
import { Table, Tooltip } from '@navikt/ds-react';

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

const HøyrestiltTekst = styled.p`
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

const utledTabellHeaderBarnetilsyn = () => {
    return (
        <Table.Row>
            <Table.HeaderCell scope="col">Periode (fom-tom)</Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltTekst>Måneds&shy;beløp</HøyrestiltTekst>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltTekst>Antall barn</HøyrestiltTekst>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltTekst>Utgifter</HøyrestiltTekst>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">Vedtaks&shy;tidspunkt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sakstype</Table.HeaderCell>
            <Table.HeaderCell scope="col">Saks&shy;behandler</Table.HeaderCell>
        </Table.Row>
    );
};

const utledTabellHeaderOvergangsstønad = () => {
    return (
        <Table.Row>
            <Table.HeaderCell scope="col">Periode (fom-tom)</Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltTekst>Måneds&shy;beløp</HøyrestiltTekst>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltTekst>Inntekts&shy;grunnlag</HøyrestiltTekst>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltTekst>Samordnings&shy;fradrag</HøyrestiltTekst>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">Vedtaks&shy;tidspunkt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sakstype</Table.HeaderCell>
            <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>
            <Table.HeaderCell scope="col">Periode&shy;type</Table.HeaderCell>
            <Table.HeaderCell scope="col">Saks&shy;behandler</Table.HeaderCell>
        </Table.Row>
    );
};

export const TabellInfotrygdOvergangsstønadperioderKompakt: React.FC<{
    perioder: InfotrygdPeriodeMedFlereEndringer[];
}> = ({ perioder }) => {
    return (
        <Table zebraStripes={true} size={'small'}>
            <Table.Header>{utledTabellHeaderOvergangsstønad()}</Table.Header>
            <Table.Body>
                {perioder.map((periode) => {
                    const stønadOgVedtaksIdString =
                        'stønadId: ' + periode.stønadId + ' vedtakId: ' + periode.vedtakId;
                    return (
                        <Table.Row key={`${periode.stønadId}-${periode.vedtakId}`}>
                            <Tooltip content={stønadOgVedtaksIdString}>
                                <Table.DataCell>
                                    {formaterNullableMånedÅr(periode.stønadFom)}
                                    {' - '}
                                    {formatStønadTom(periode)}
                                </Table.DataCell>
                            </Tooltip>
                            <Table.DataCell>
                                <HøyrestiltTekst>
                                    {formaterTallMedTusenSkille(periode.månedsbeløp)}
                                </HøyrestiltTekst>
                            </Table.DataCell>
                            <Table.DataCell>
                                <HøyrestiltTekst>
                                    {formaterTallMedTusenSkille(periode.inntektsgrunnlag)}
                                </HøyrestiltTekst>
                            </Table.DataCell>
                            <Table.DataCell>
                                <HøyrestiltTekst>
                                    {formaterTallMedTusenSkille(periode.samordningsfradrag)}
                                </HøyrestiltTekst>
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
                    );
                })}
            </Table.Body>
        </Table>
    );
};

export const TabellInfotrygdBarnetilsynperioderKompakt: React.FC<{
    perioder: InfotrygdPeriodeMedFlereEndringer[];
}> = ({ perioder }) => {
    return (
        <Table zebraStripes={true} size={'small'}>
            <Table.Header>{utledTabellHeaderBarnetilsyn()}</Table.Header>
            <Table.Body>
                {perioder.map((periode) => {
                    const stønadOgVedtaksIdString =
                        'stønadId: ' + periode.stønadId + ' vedtakId: ' + periode.vedtakId;
                    return (
                        <Table.Row key={`${periode.stønadId}-${periode.vedtakId}`}>
                            <Tooltip content={stønadOgVedtaksIdString}>
                                <Table.DataCell>
                                    {formaterNullableMånedÅr(periode.stønadFom)}
                                    {' - '}
                                    {formatStønadTom(periode)}
                                </Table.DataCell>
                            </Tooltip>
                            <Table.DataCell>
                                <HøyrestiltTekst>
                                    {formaterTallMedTusenSkille(periode.månedsbeløp)}
                                </HøyrestiltTekst>
                            </Table.DataCell>
                            <Table.DataCell>
                                <HøyrestiltTekst>{periode.barnIdenter.length}</HøyrestiltTekst>
                            </Table.DataCell>
                            <Table.DataCell>
                                <HøyrestiltTekst>
                                    {formaterTallMedTusenSkille(periode.utgifterBarnetilsyn)}
                                </HøyrestiltTekst>
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
                    );
                })}
            </Table.Body>
        </Table>
    );
};

export const InfotrygdPerioderSkolepenger: React.FC<{
    perioder: InfotrygdPeriodeMedFlereEndringer[];
}> = ({ perioder }) => {
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
