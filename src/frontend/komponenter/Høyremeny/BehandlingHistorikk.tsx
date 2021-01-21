import * as React from 'react';
import { useMemo } from 'react';
import { AxiosRequestConfig } from 'axios';
import { Ressurs } from '../../typer/ressurs';
import { useDataHenter } from '../../hooks/felles/useDataHenter';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import styled from 'styled-components';
import Moment from 'moment';
import { Steg, StegVerdi } from './Steg';
import compareDesc from 'date-fns/compareDesc';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

interface BehandlingHistorikkProps {
    behandlingId: string;
    steg: Steg;
    endretAvNavn: string;
    endretAvMail: string;
    endretTid: string;
}

const ListElementStyle = styled.li`
    border-bottom: 1px solid #c6c2bf;
    background: white;
    list-style: none;
    margin: 0;
    padding-inline-start: 0px;
`;

function formatDate(date: string) {
    return Moment(date).format('DD-MM-YYYY - HH:mm').toString();
}

const BehandlingHistorikk = (props: { behandlingId: string }) => {
    const behandlingHistorikkLogg: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/behandlinghistorikk/${props.behandlingId}`,
        }),
        [props.behandlingId]
    );

    const behandlingHistorikk: Ressurs<BehandlingHistorikkProps[]> = useDataHenter<
        BehandlingHistorikkProps[],
        null
    >(behandlingHistorikkLogg);

    return (
        <DataViewer response={behandlingHistorikk}>
            {(data: BehandlingHistorikkProps[]) => {
                return (
                    <>
                        {data
                            .sort((a, b) =>
                                compareDesc(new Date(a.endretTid), new Date(b.endretTid))
                            )
                            .map((v) => (
                                <ListElementStyle>
                                    <ul>
                                        <Element>{StegVerdi.get(v.steg)}</Element>
                                        <Normaltekst>{v.endretAvNavn}</Normaltekst>
                                        <Undertekst>{formatDate(v.endretTid)}</Undertekst>
                                    </ul>
                                </ListElementStyle>
                            ))}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default BehandlingHistorikk;
