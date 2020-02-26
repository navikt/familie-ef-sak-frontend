import { ISaksbehandler } from '../typer/saksbehandler';
import { Ressurs } from '../typer/ressurs';
import { axiosRequest } from './axios';
import { IPerson } from '../typer/person';

export const hentPersoninfo = (
    id: string,
    innloggetSaksbehandler?: ISaksbehandler
): Promise<Ressurs<IPerson>> => {
    return axiosRequest<IPerson>(
        {
            method: 'POST',
            url: `/familie-ef-sak/api/personinfo/`,
            data: id,
        },
        innloggetSaksbehandler
    );
};
