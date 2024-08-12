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
import { Table } from '@navikt/ds-react';

const InfotrygdSakerTabell: FC<{ saker: InfotrygdSak[] }> = ({ saker }) => {
    if (saker.length === 0) {
        return <>Ingen saker i Infotrygd</>;
    }
    return (
        <Table>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Saksblokk</Table.HeaderCell>
                    <Table.HeaderCell>Mottatt</Table.HeaderCell>
                    <Table.HeaderCell>Personidentifikator</Table.HeaderCell>
                    <Table.HeaderCell>Vedtatt</Table.HeaderCell>
                    <Table.HeaderCell>Iverksatt</Table.HeaderCell>
                    <Table.HeaderCell>Stønad</Table.HeaderCell>
                    <Table.HeaderCell>Undervalg</Table.HeaderCell>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Nivå</Table.HeaderCell>
                    <Table.HeaderCell>Resultat</Table.HeaderCell>
                    <Table.HeaderCell>Årsak</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {saker.map((sak) => (
                    <Table.Row key={`${sak.id}-${sak.saksblokk}-${sak.tkNr}`}>
                        <Table.DataCell>{sak.saksblokk}</Table.DataCell>
                        <Table.DataCell>{formaterNullableIsoDato(sak.mottattDato)}</Table.DataCell>
                        <Table.DataCell>{sak.personIdent}</Table.DataCell>
                        <Table.DataCell>{formaterNullableIsoDato(sak.vedtaksdato)}</Table.DataCell>
                        <Table.DataCell>
                            {formaterNullableIsoDato(sak.iverksattdato)}
                        </Table.DataCell>
                        <Table.DataCell>{stønadstypeTilTekst[sak.stønadType]}</Table.DataCell>
                        <Table.DataCell>{sak.undervalg}</Table.DataCell>
                        <Table.DataCell>
                            {tekstMapping(sak.type, infotrygdSakTypeTilTekst)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {tekstMapping(sak.nivå, infotrygdSakNivåTilTekst)}
                        </Table.DataCell>
                        <Table.DataCell>
                            {tekstMapping(sak.resultat, infotrygdSakResultatTilTekst)}
                        </Table.DataCell>
                        <Table.DataCell>{sak.årsakskode}</Table.DataCell>
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
                <>
                    <h2>Saker</h2>
                    <InfotrygdSakerTabell saker={infotrygdSaker.saker} />
                </>
            )}
        </DataViewer>
    );
};

export default InfotrygdSaker;
