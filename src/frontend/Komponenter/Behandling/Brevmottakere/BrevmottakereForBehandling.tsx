import React, { FC, useCallback, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { useApp } from '../../../App/context/AppContext';
import { IBrevmottakere } from './typer';
import {
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { AxiosRequestConfig } from 'axios';
import { useBehandling } from '../../../App/context/BehandlingContext';
import Brevmottakere from './Brevmottakere';

export const BrevmottakereForBehandling: FC<{
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
}> = ({ personopplysninger, behandlingId }) => {
    const { axiosRequest } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const [mottakere, settMottakere] = useState<Ressurs<IBrevmottakere | undefined>>(
        byggTomRessurs()
    );

    const settBrevmottakere = (brevmottakere: IBrevmottakere) =>
        axiosRequest<string, IBrevmottakere>({
            url: `familie-ef-sak/api/brevmottakere/${behandlingId}`,
            method: 'POST',
            data: brevmottakere,
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                settMottakere(byggSuksessRessurs(brevmottakere));
            }
            return res;
        });

    const hentBrevmottakere = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `familie-ef-sak/api/brevmottakere/${behandlingId}`,
        };
        return axiosRequest<IBrevmottakere | undefined, null>(behandlingConfig).then(
            (res: RessursSuksess<IBrevmottakere | undefined> | RessursFeilet) => {
                settMottakere(res);
                return res;
            }
        );
    }, [axiosRequest, behandlingId]);

    useEffect(() => {
        hentBrevmottakere();
    }, [hentBrevmottakere]);

    return (
        <DataViewer response={{ mottakere }}>
            {({ mottakere }) => (
                <Brevmottakere
                    personopplysninger={personopplysninger}
                    mottakere={mottakere}
                    kallSettBrevmottakere={settBrevmottakere}
                    kanEndreBrevmottakere={behandlingErRedigerbar}
                />
            )}
        </DataViewer>
    );
};
