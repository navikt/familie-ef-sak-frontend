import * as React from 'react';
import {useMemo} from 'react';
import {AxiosRequestConfig} from 'axios';
import {Ressurs} from '../../typer/ressurs';
import {useDataHenter} from '../../hooks/felles/useDataHenter';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import  { LoggItem } from '@navikt/helse-frontend-logg/lib/src/components/LoggItem';
import { HendelseMedId, Hendelsetype} from '@navikt/helse-frontend-logg/src/types';

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

function hendelser(behandlinger: BehandlingHistorikkProps[]) : HendelseMedId[] {
    const hendelser : HendelseMedId[] =
        behandlinger.map(it => {
            const hendelse : HendelseMedId = {
                id: it.behandlingId,
                navn: it.steg.toString(),
                type: Hendelsetype.Meldinger,
                dato: it.endretTid
            };
            return hendelse;
        });
    return hendelser;
    }
const BehandlingHistorikk = (props: { behandlingId: string }) => {

    const behandlingHistorikkLogg: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/behandlinghistorikk/${props.behandlingId}`,
        }),
        [props.behandlingId]
    );

    const behandlingHistorikk: Ressurs<BehandlingHistorikkProps[]> = useDataHenter<BehandlingHistorikkProps[],
        null>(behandlingHistorikkLogg);


    return (
        <DataViewer response={behandlingHistorikk}>
            {(data: BehandlingHistorikkProps[]) => {
                return (
                    <>
                        {hendelser(data).map((v) => (
                            <div>
                                <LoggItem key={v.id} hendelse={v}  />
                            </div>
                        ))}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default BehandlingHistorikk;
