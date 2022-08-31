import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NyeBarnSidenForrigeBehandling } from '../../App/typer/revurderingstype';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { EVilkårsbehandleBarnValg } from '../../App/typer/vilkårsbehandleBarnValg';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { NyeBarn } from '../../Felles/NyeBarn/NyeBarn';
import { Fagsak } from '../../App/typer/fagsak';
import { BehandlingStatus } from '../../App/typer/behandlingstatus';

const harBehandlingOgAlleErFerdigstilte = (fagsak: Fagsak) =>
    fagsak.behandlinger.length > 0 &&
    fagsak.behandlinger.every((b) => b.status === BehandlingStatus.FERDIGSTILT);

const EttersendingMedNyeBarn: React.FC<{
    fagsak: Fagsak;
    vilkårsbehandleNyeBarn: EVilkårsbehandleBarnValg;
    settVilkårsbehandleNyeBarn: Dispatch<SetStateAction<EVilkårsbehandleBarnValg>>;
}> = ({ fagsak, vilkårsbehandleNyeBarn, settVilkårsbehandleNyeBarn }) => {
    const { axiosRequest } = useApp();

    const [nyeBarnSidenForrigeBehandling, settNyeBarnSidenForrigeBehandling] = useState<
        Ressurs<NyeBarnSidenForrigeBehandling>
    >(byggTomRessurs());

    useEffect(() => {
        if (harBehandlingOgAlleErFerdigstilte(fagsak)) {
            axiosRequest<NyeBarnSidenForrigeBehandling, null>({
                url: `familie-ef-sak/api/behandling/barn/fagsak/${fagsak.id}`,
            }).then((response: RessursSuksess<NyeBarnSidenForrigeBehandling> | RessursFeilet) => {
                settNyeBarnSidenForrigeBehandling(response);
            });
        }
    }, [axiosRequest, fagsak]);

    useEffect(() => {
        if (
            nyeBarnSidenForrigeBehandling.status === RessursStatus.SUKSESS &&
            nyeBarnSidenForrigeBehandling.data.harBarnISisteIverksatteBehandling
        ) {
            settVilkårsbehandleNyeBarn(EVilkårsbehandleBarnValg.VILKÅRSBEHANDLE);
        }
        return () => settVilkårsbehandleNyeBarn(EVilkårsbehandleBarnValg.IKKE_VALGT);
    }, [settVilkårsbehandleNyeBarn, nyeBarnSidenForrigeBehandling]);

    return (
        <DataViewer response={{ nyeBarnSidenForrigeBehandling }}>
            {({ nyeBarnSidenForrigeBehandling }) => {
                if (!nyeBarnSidenForrigeBehandling.nyeBarn.length) {
                    return null;
                }
                return (
                    <NyeBarn
                        nyeBarnSidenForrigeBehandling={nyeBarnSidenForrigeBehandling.nyeBarn}
                        måTaStillingTilBarn={
                            !nyeBarnSidenForrigeBehandling.harBarnISisteIverksatteBehandling
                        }
                        vilkårsbehandleNyeBarn={vilkårsbehandleNyeBarn}
                        settVilkårsbehandleNyeBarn={settVilkårsbehandleNyeBarn}
                    />
                );
            }}
        </DataViewer>
    );
};

export default EttersendingMedNyeBarn;
