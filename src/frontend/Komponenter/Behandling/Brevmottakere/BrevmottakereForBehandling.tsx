import React, { Dispatch, FC, SetStateAction, useCallback, useEffect } from 'react';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { useApp } from '../../../App/context/AppContext';
import { IBrevmottakere } from './typer';
import {
    byggSuksessRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Brevmottakere } from './Brevmottakere';
import { ModalState } from '../Modal/NyEierModal';

export const BrevmottakereForBehandling: FC<{
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    brevmottakere: IBrevmottakere | undefined;
    settBrevMottakere: Dispatch<SetStateAction<Ressurs<IBrevmottakere | undefined>>>;
}> = ({ personopplysninger, behandlingId, brevmottakere, settBrevMottakere }) => {
    const { axiosRequest } = useApp();
    const { hentAnsvarligSaksbehandler, behandlingErRedigerbar, settNyEierModalState } =
        useBehandling();

    const oppdaterBrevmottakere = (brevmottakere: IBrevmottakere) =>
        axiosRequest<string, IBrevmottakere>({
            url: `familie-ef-sak/api/brevmottakere/${behandlingId}`,
            method: 'POST',
            data: brevmottakere,
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                settBrevMottakere(byggSuksessRessurs(brevmottakere));
            } else {
                settNyEierModalState(ModalState.LUKKET);
                hentAnsvarligSaksbehandler.rerun();
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
                settBrevMottakere(res);
                return res;
            }
        );
    }, [axiosRequest, behandlingId, settBrevMottakere]);

    useEffect(() => {
        hentBrevmottakere();
    }, [hentBrevmottakere]);

    return (
        <Brevmottakere
            personopplysninger={personopplysninger}
            mottakere={brevmottakere}
            kallSettBrevmottakere={oppdaterBrevmottakere}
            kanEndreBrevmottakere={behandlingErRedigerbar}
        />
    );
};
