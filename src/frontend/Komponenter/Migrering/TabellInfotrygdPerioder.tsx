import React from 'react';
import { InfotrygdPeriodeMedFlereEndringer } from '../Infotrygd/typer';
import { Stønadstype } from '../../App/typer/behandlingstema';
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
import { useWindowSize } from '../../App/hooks/felles/useWindowSize';
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

const utledTabellHeader = (width: number, stønadstype: Stønadstype) => {
    const erOS = stønadstype === Stønadstype.OVERGANGSSTØNAD;
    const erBT = stønadstype === Stønadstype.BARNETILSYN;
    return width >= 1370 ? (
        <Table.Row>
            <Table.HeaderCell scope="col">Periode (fom-tom)</Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltTekst>Månedsbeløp</HøyrestiltTekst>
            </Table.HeaderCell>
            {erBT && (
                <Table.HeaderCell scope="col">
                    <HøyrestiltTekst>Antall barn</HøyrestiltTekst>
                </Table.HeaderCell>
            )}
            {erOS && (
                <Table.HeaderCell scope="col">
                    <HøyrestiltTekst>Inntektsgrunnlag</HøyrestiltTekst>
                </Table.HeaderCell>
            )}
            {erOS && (
                <Table.HeaderCell scope="col">
                    <HøyrestiltTekst>Samordningsfradrag</HøyrestiltTekst>
                </Table.HeaderCell>
            )}
            {erBT && (
                <Table.HeaderCell scope="col">
                    <HøyrestiltTekst>Utgifter</HøyrestiltTekst>
                </Table.HeaderCell>
            )}
            <Table.HeaderCell scope="col">Vedtakstidspunkt</Table.HeaderCell>
            <Table.HeaderCell scope="col">Kode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sakstype</Table.HeaderCell>
            {erOS && <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>}
            {erOS && <Table.HeaderCell scope="col">Periodetype</Table.HeaderCell>}
            <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
        </Table.Row>
    ) : (
        <Table.Row>
            <Table.HeaderCell scope="col">
                Periode <br /> (fom-tom)
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
                <HøyrestiltTekst>
                    Måned- <br /> beløp
                </HøyrestiltTekst>
            </Table.HeaderCell>
            {erBT && (
                <Table.HeaderCell scope="col">
                    <HøyrestiltTekst>
                        Antall- <br /> barn
                    </HøyrestiltTekst>
                </Table.HeaderCell>
            )}
            {erOS && (
                <Table.HeaderCell scope="col">
                    <HøyrestiltTekst>
                        Inntekt- <br /> grunnlag
                    </HøyrestiltTekst>
                </Table.HeaderCell>
            )}
            {erOS && (
                <Table.HeaderCell scope="col">
                    <HøyrestiltTekst>
                        Samordning- <br /> fradrag
                    </HøyrestiltTekst>
                </Table.HeaderCell>
            )}
            {erBT && (
                <Table.HeaderCell scope="col">
                    <HøyrestiltTekst>Utgifter</HøyrestiltTekst>
                </Table.HeaderCell>
            )}
            <Table.HeaderCell scope="col">
                Vedtak- <br /> tidspunkt
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">Kode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Sakstype</Table.HeaderCell>
            {erOS && <Table.HeaderCell scope="col">Aktivitet</Table.HeaderCell>}
            {erOS && <Table.HeaderCell scope="col">Periodetype</Table.HeaderCell>}
            <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
        </Table.Row>
    );
};

export const TabellInfotrygdPerioder: React.FC<{
    perioder: InfotrygdPeriodeMedFlereEndringer[];
    stønadstype: Stønadstype;
}> = ({ perioder, stønadstype }) => {
    const erOS = stønadstype === Stønadstype.OVERGANGSSTØNAD;
    const erBT = stønadstype === Stønadstype.BARNETILSYN;

    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>
                        Periode <br />
                        (fom-tom)
                    </th>
                    <th>Månedsbeløp</th>
                    {erBT && <th>Antall barn</th>}
                    {erOS && <th>Inntektsgrunnlag</th>}
                    {erOS && <th>Samordningsfradrag</th>}
                    {erBT && <th>Utgifter</th>}
                    <th>Vedtakstidspunkt</th>
                    <th>Kode</th>
                    <th>Sakstype</th>
                    {erOS && <th>Aktivitet</th>}
                    {erOS && <th>Periodetype</th>}
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
                        {erBT && <td>{periode.barnIdenter.length}</td>}
                        {erOS && <td>{formaterTallMedTusenSkille(periode.inntektsgrunnlag)}</td>}
                        {erOS && <td>{formaterTallMedTusenSkille(periode.samordningsfradrag)}</td>}
                        {erBT && <td>{formaterTallMedTusenSkille(periode.utgifterBarnetilsyn)}</td>}
                        <td>{formaterNullableIsoDato(periode.vedtakstidspunkt)}</td>
                        <td>
                            {kodeTilTekst[periode.kode]}{' '}
                            {periode.initiellKode && `(${kodeTilTekst[periode.initiellKode]})`}
                        </td>
                        <td>{sakstypeTilTekst[periode.sakstype]}</td>
                        {erOS && (
                            <td>
                                {periode.aktivitetstype &&
                                    aktivitetstypeTilTekst[periode.aktivitetstype]}
                            </td>
                        )}
                        {erOS && (
                            <td>
                                {periode.kodeOvergangsstønad &&
                                    overgangsstønadKodeTilTekst[periode.kodeOvergangsstønad]}
                            </td>
                        )}
                        <td>{periode.brukerId}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
    );
};

export const TabellInfotrygdPerioderKompakt: React.FC<{
    perioder: InfotrygdPeriodeMedFlereEndringer[];
    stønadstype: Stønadstype;
}> = ({ perioder, stønadstype }) => {
    const { width } = useWindowSize();
    const erOS = stønadstype === Stønadstype.OVERGANGSSTØNAD;
    const erBT = stønadstype === Stønadstype.BARNETILSYN;
    return (
        <Table zebraStripes={true} size={'small'}>
            <Table.Header>{utledTabellHeader(width, stønadstype)}</Table.Header>
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
                            {erBT && (
                                <Table.DataCell>
                                    <HøyrestiltTekst>{periode.barnIdenter.length}</HøyrestiltTekst>
                                </Table.DataCell>
                            )}
                            {erOS && (
                                <Table.DataCell>
                                    <HøyrestiltTekst>
                                        {formaterTallMedTusenSkille(periode.inntektsgrunnlag)}
                                    </HøyrestiltTekst>
                                </Table.DataCell>
                            )}
                            {erOS && (
                                <Table.DataCell>
                                    <HøyrestiltTekst>
                                        {formaterTallMedTusenSkille(periode.samordningsfradrag)}
                                    </HøyrestiltTekst>
                                </Table.DataCell>
                            )}
                            {erBT && (
                                <Table.DataCell>
                                    <HøyrestiltTekst>
                                        {formaterTallMedTusenSkille(periode.utgifterBarnetilsyn)}
                                    </HøyrestiltTekst>
                                </Table.DataCell>
                            )}
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
                            {erOS && (
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
                            )}
                            {erOS && (
                                <Table.DataCell>
                                    {periode.kodeOvergangsstønad && (
                                        <Tooltip
                                            content={
                                                overgangsstønadKodeTilTekst[
                                                    periode.kodeOvergangsstønad
                                                ]
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
                            )}
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
