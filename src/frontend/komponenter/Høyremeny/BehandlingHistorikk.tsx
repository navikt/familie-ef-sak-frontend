import * as React from 'react';
import { useMemo } from 'react';
import { AxiosRequestConfig } from 'axios';
import { Ressurs } from '../../typer/ressurs';
import { useDataHenter } from '../../hooks/felles/useDataHenter';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import Moment from 'moment';
import './LoggItem.less';

export enum Steg {
    REGISTRERE_OPPLYSNINGER = 'Mottat opplysninger',
    VILKÅRSVURDERE_INNGANGSVILKÅR = 'Vilkårsvurdering startet',
    VILKÅRSVURDERE_STØNAD = 'Vilkårsvurere stønad',
}

interface BehandlingHistorikkProps {
    behandlingId: string;
    steg: Steg;
    endretAvNavn: string;
    endretAvMail: string;
    endretTid: string;
}

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
                        {data.map((v) => (
                            <ul className="list">
                                <li className="loggitem">
                                    <p className="hendelsesnavn">{v.steg}</p>
                                    <p className="hendelsesdato">{formatDate(v.endretTid)}</p>
                                </li>
                            </ul>
                        ))}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default BehandlingHistorikk;
