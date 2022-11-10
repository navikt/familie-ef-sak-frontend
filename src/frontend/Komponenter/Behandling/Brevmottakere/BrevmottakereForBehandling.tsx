import React, { FC, useCallback, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { useApp } from '../../../App/context/AppContext';
import { IBrevmottakere } from './typer';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { AxiosRequestConfig } from 'axios';
import { useBehandling } from '../../../App/context/BehandlingContext';
import Brevmottakere from './Brevmottakere';

export const BrevmottakereForBehandling: FC<{
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
}> = ({ personopplysninger, behandlingId }) => {
    const { axiosRequest, toast } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    const [mottakere, settMottakere] = useState<Ressurs<IBrevmottakere | undefined>>(
        byggTomRessurs()
    );

    const settBrevmottakere = (brevmottakere: IBrevmottakere) =>
        axiosRequest<string, IBrevmottakere>({
            url: `familie-ef-sak/api/brevmottakere/${behandlingId}`,
            method: 'POST',
            data: brevmottakere,
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
        // toast brukes for å oppdatere brevmottakere fra hamburgermeny, kan fjernes når man fjernet sette mottakere fra hamburger
    }, [hentBrevmottakere, toast]);

    return (
        <DataViewer response={{ mottakere }}>
            {({ mottakere }) => (
                <Brevmottakere
                    personopplysninger={personopplysninger}
                    mottakere={mottakere}
                    kallSettBrevmottakere={settBrevmottakere}
                    kallHentBrevmottakere={hentBrevmottakere}
                    kanEndreBrevmottakere={!behandlingErRedigerbar}
                />
            )}
        </DataViewer>
    );
};
