import * as React from 'react';
import { useMemo } from 'react';
import { AxiosRequestConfig } from 'axios';
import { Ressurs } from '../../typer/ressurs';
import { useDataHenter } from '../../hooks/felles/useDataHenter';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';

interface BehandlingHistorikk {
    behandlingId: string;
    steg: string; //TODO ENUM
    endretAvNavn: string;
    endretAvMail: string;
    endretTid: string;
}
const stegTilTekst = {
    REGISTRERE_OPPLYSNINGER: 'Mottat opplysninger',
    VILKÅRSVURDERE_INNGANGSVILKÅR: 'Vilkårsvurdering startet',
};

const BehandlingHistorikk = (props: { behandlingId: string }) => {
    const behandlingHistorikkLogg: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/behandlinghistorikk/${props.behandlingId}`,
        }),
        [props.behandlingId]
    );

    const behandlingHistorikk: Ressurs<BehandlingHistorikk[]> = useDataHenter<
        BehandlingHistorikk[],
        null
    >(behandlingHistorikkLogg);

    return (
        <DataViewer response={behandlingHistorikk}>
            {(data: BehandlingHistorikk[]) => {
                return (
                    <>
                        {data.map((v) => (
                            <div>{stegTilTekst[v.steg] || v.steg}</div>
                        ))}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default BehandlingHistorikk;
