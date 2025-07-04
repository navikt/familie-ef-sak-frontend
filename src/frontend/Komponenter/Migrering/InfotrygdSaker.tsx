import React, { FC, useMemo } from 'react';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import {
    InfotrygdSak,
    InfotrygdSakerResponse,
    infotrygdSakNivåTilTekst,
    infotrygdSakResultatTilTekst,
    infotrygdSakTypeTilTekst,
} from '../../App/typer/infotrygd';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { stønadstypeTilTekst } from '../../App/typer/behandlingstema';
import { tekstMapping } from '../../App/utils/tekstmapping';
import { Heading, Table } from '@navikt/ds-react';
import {
    TableDataCellSmall,
    TableHeaderCellSmall,
} from '../Personoversikt/HistorikkVedtaksperioder/vedtakshistorikkUtil';

const InfotrygdSakerTabell: FC<{ saker: InfotrygdSak[] }> = ({ saker }) => {
    if (saker.length === 0) {
        return <>Ingen saker i Infotrygd</>;
    }
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <TableHeaderCellSmall>Saksblokk</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Mottatt</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Personidentifikator</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Vedtatt</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Iverksatt</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Stønad</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Undervalg</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Type</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Nivå</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Resultat</TableHeaderCellSmall>
                    <TableHeaderCellSmall>Årsak</TableHeaderCellSmall>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {saker.map((sak) => (
                    <Table.Row key={`${sak.id}-${sak.saksblokk}-${sak.tkNr}`}>
                        <TableDataCellSmall>{sak.saksblokk}</TableDataCellSmall>
                        <TableDataCellSmall>
                            {formaterNullableIsoDato(sak.mottattDato)}
                        </TableDataCellSmall>
                        <TableDataCellSmall>{sak.personIdent}</TableDataCellSmall>
                        <TableDataCellSmall>
                            {formaterNullableIsoDato(sak.vedtaksdato)}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {formaterNullableIsoDato(sak.iverksattdato)}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {stønadstypeTilTekst[sak.stønadType]}
                        </TableDataCellSmall>
                        <TableDataCellSmall>{sak.undervalg}</TableDataCellSmall>
                        <TableDataCellSmall>
                            {tekstMapping(sak.type, infotrygdSakTypeTilTekst)}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {tekstMapping(sak.nivå, infotrygdSakNivåTilTekst)}
                        </TableDataCellSmall>
                        <TableDataCellSmall>
                            {tekstMapping(sak.resultat, infotrygdSakResultatTilTekst)}
                        </TableDataCellSmall>
                        <TableDataCellSmall>{sak.årsakskode}</TableDataCellSmall>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table>
    );
};

const InfotrygdSaker: FC<{ personIdent: string }> = ({ personIdent }) => {
    const infotrygdSakerConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/infotrygd/saker`,
            data: {
                personIdent,
            },
        }),
        [personIdent]
    );
    const infotrygdSaker = useDataHenter<InfotrygdSakerResponse, null>(infotrygdSakerConfig);
    return (
        <DataViewer response={{ infotrygdSaker }}>
            {({ infotrygdSaker }) => (
                <div>
                    <Heading size={'medium'}>Saker</Heading>
                    <InfotrygdSakerTabell saker={infotrygdSaker.saker} />
                </div>
            )}
        </DataViewer>
    );
};

export default InfotrygdSaker;
