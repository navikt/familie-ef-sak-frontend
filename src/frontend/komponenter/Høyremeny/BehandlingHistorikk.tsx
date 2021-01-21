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
`;
const Element = styled.div`
    font-weight: bold;
    padding: 0;
`;
const Normaltekst = styled.div`
    line-height: 0;
`;
const Undertekst = styled.div`
    color: grey;
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
                                <ul>
                                    <ListElementStyle>
                                        <Element>
                                            <p>{StegVerdi.get(v.steg)}</p>
                                        </Element>
                                        <Normaltekst>
                                            <p>{v.endretAvNavn}</p>
                                        </Normaltekst>
                                        <Undertekst>
                                            <p>{formatDate(v.endretTid)}</p>
                                        </Undertekst>
                                    </ListElementStyle>
                                </ul>
                            ))}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default BehandlingHistorikk;
