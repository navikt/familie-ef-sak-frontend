import React, { FC, useMemo } from 'react';
import { formaterNullableIsoDato } from '../../App/utils/formatter';
import {
    InfotrygdSak,
    InfotrygdSakerResponse,
    infotrygdSakNivåTilTekst,
    infotrygdSakResultatTilTekst,
    infotrygdSakTypeTilTekst,
} from '../../App/typer/infotrygd';
import styled from 'styled-components';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { stønadstypeTilTekst } from '../../App/typer/behandlingstema';
import { tekstMapping } from '../../App/utils/tekstmapping';

const StyledTabell = styled.table``;

const Rad = styled.tr``;

const InfotrygdSakerTabell: FC<{ saker: InfotrygdSak[] }> = ({ saker }) => {
    if (saker.length === 0) {
        return <>Ingen saker i Infotrygd</>;
    }
    return (
        <StyledTabell className="tabell">
            <thead>
                <tr>
                    <th>Saksblokk</th>
                    <th>Mottatt</th>
                    <th>Personidentifikator</th>
                    <th>Vedtatt</th>
                    <th>Iverksatt</th>
                    <th>Stønad</th>
                    <th>Undervalg</th>
                    <th>Type</th>
                    <th>Nivå</th>
                    <th>Resultat</th>
                    <th>Årsak</th>
                </tr>
            </thead>
            <tbody>
                {saker.map((sak) => (
                    <Rad key={`${sak.id}-${sak.saksblokk}-${sak.tkNr}`}>
                        <td>{sak.saksblokk}</td>
                        <td>{formaterNullableIsoDato(sak.mottattDato)}</td>
                        <td>{sak.personIdent}</td>
                        <td>{formaterNullableIsoDato(sak.vedtaksdato)}</td>
                        <td>{formaterNullableIsoDato(sak.iverksattdato)}</td>
                        <td>{stønadstypeTilTekst[sak.stønadType]}</td>
                        <td>{sak.undervalg}</td>
                        <td>{tekstMapping(sak.type, infotrygdSakTypeTilTekst)}</td>
                        <td>{tekstMapping(sak.nivå, infotrygdSakNivåTilTekst)}</td>
                        <td>{tekstMapping(sak.resultat, infotrygdSakResultatTilTekst)}</td>
                        <td>{sak.årsakskode}</td>
                    </Rad>
                ))}
            </tbody>
        </StyledTabell>
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
