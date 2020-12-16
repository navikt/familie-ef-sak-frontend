import * as React from 'react';
import { useMemo } from 'react';
import { AxiosRequestConfig } from 'axios';
import { Ressurs } from '../../typer/ressurs';
import { useDataHenter } from '../../hooks/felles/useDataHenter';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { BrukerMedBlyantIkon } from '../Felleskomponenter/Visning/DataGrunnlagIkoner';
import Moment from 'moment';

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
    vedtak: string;
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
                            <div>
                                {v.steg && v.steg}
                                <br />
                                <BrukerMedBlyantIkon />
                                {v.endretAvNavn && v.endretAvNavn}
                                <br />
                                {v.endretTid && formatDate(v.endretTid)}
                                <br />
                            </div>
                        ))}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default BehandlingHistorikk;
