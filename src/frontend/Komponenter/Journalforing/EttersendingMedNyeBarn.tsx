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

const EttersendingMedNyeBarn: React.FC<{
    fagsakId: string;
    vilkårsbehandleNyeBarn: EVilkårsbehandleBarnValg;
    settVilkårsbehandleNyeBarn: Dispatch<SetStateAction<EVilkårsbehandleBarnValg>>;
}> = ({ fagsakId, vilkårsbehandleNyeBarn, settVilkårsbehandleNyeBarn }) => {
    const { axiosRequest } = useApp();

    const [nyeBarnSidenForrigeBehandling, settNyeBarnSidenForrigeBehandling] = useState<
        Ressurs<NyeBarnSidenForrigeBehandling>
    >(byggTomRessurs());

    useEffect(() => {
        axiosRequest<NyeBarnSidenForrigeBehandling, null>({
            url: `familie-ef-sak/api/behandling/barn/fagsak/${fagsakId}`,
        }).then((response: RessursSuksess<NyeBarnSidenForrigeBehandling> | RessursFeilet) => {
            settNyeBarnSidenForrigeBehandling(response);
        });
    }, [axiosRequest, fagsakId]);

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
