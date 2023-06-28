import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { useApp } from '../../../App/context/AppContext';
import { IBrevmottakere } from './typer';
import {
    byggTomRessurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { AxiosRequestConfig } from 'axios';
import Brevmottakere from './Brevmottakere';

export const BrevmottakereFrittståendeBrev: FC<{
    fagsakId: string;
    personopplysninger: IPersonopplysninger;
    mottakere: IBrevmottakere | undefined;
    settMottakere: Dispatch<SetStateAction<IBrevmottakere | undefined>>;
}> = ({ personopplysninger, fagsakId, mottakere, settMottakere }) => {
    const { axiosRequest } = useApp();

    const [mottakereRessurs, settMottakereRessurs] = useState(
        byggTomRessurs<IBrevmottakere | undefined>()
    );

    const settBrevmottakere = (brevmottakere: IBrevmottakere) =>
        axiosRequest<string, IBrevmottakere>({
            url: `familie-ef-sak/api/brevmottakere/fagsak/${fagsakId}`,
            method: 'POST',
            data: brevmottakere,
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                settMottakere(brevmottakere);
            }
            return res;
        });

    const hentBrevmottakere = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `familie-ef-sak/api/brevmottakere/fagsak/${fagsakId}`,
        };
        return axiosRequest<IBrevmottakere | undefined, null>(behandlingConfig).then(
            (res: RessursSuksess<IBrevmottakere | undefined> | RessursFeilet) => {
                if (res.status === RessursStatus.SUKSESS && res.data) {
                    settMottakere(res.data);
                }
                settMottakereRessurs(res);
            }
        );
    }, [axiosRequest, fagsakId, settMottakere]);

    useEffect(() => {
        hentBrevmottakere();
    }, [hentBrevmottakere]);

    return (
        <DataViewer response={{ mottakereRessurs }}>
            {() => (
                <Brevmottakere
                    personopplysninger={personopplysninger}
                    mottakere={mottakere}
                    kallSettBrevmottakere={settBrevmottakere}
                />
            )}
        </DataViewer>
    );
};
