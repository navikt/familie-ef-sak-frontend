import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { NyeBarnSidenForrigeBehandling } from '../../App/typer/revurderingstype';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursSuksess } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { EVilkårsbehandleBarnValg } from '../../App/typer/vilkårsbehandleBarnValg';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { NyeBarn } from '../../Felles/NyeBarn/NyeBarn';
import styled from 'styled-components';

const NyeBarnWrapper = styled.div`
    //max-width: 60rem;
`;

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

    return (
        <DataViewer response={{ nyeBarnSidenForrigeBehandling }}>
            {({ nyeBarnSidenForrigeBehandling }) => {
                return (
                    <NyeBarnWrapper>
                        <NyeBarn
                            nyeBarnSidenForrigeBehandling={nyeBarnSidenForrigeBehandling.nyeBarn}
                            måTaStillingTilBarn={
                                !nyeBarnSidenForrigeBehandling.harBarnISisteIverksatteBehandling
                            }
                            vilkårsbehandleNyeBarn={vilkårsbehandleNyeBarn}
                            settVilkårsbehandleNyeBarn={settVilkårsbehandleNyeBarn}
                        />
                    </NyeBarnWrapper>
                );
            }}
        </DataViewer>
    );
};

export default EttersendingMedNyeBarn;
