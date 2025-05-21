import { ISaksbehandler, Saksbehandler } from '../typer/saksbehandler';
import { preferredAxios } from './axios';
import { Ressurs, RessursStatus } from '../typer/ressurs';
import { AxiosResponse } from 'axios';

export const hentInnloggetBruker = (): Promise<ISaksbehandler> => {
    return preferredAxios.get(`/user/profile`).then((response) => {
        return response.data;
    });
};

export const hentSaksbehandlerInfo = () => {
    return preferredAxios
        .get(`/familie-ef-sak/api/saksbehandler/saksbehandler-informasjon`)
        .then((response: AxiosResponse<Ressurs<Saksbehandler>>) => {
            if (response.data.status === RessursStatus.SUKSESS) {
                return response.data.data;
            }
        });
};
