import { ISaksbehandler } from '../typer/saksbehandler';
import { Ressurs } from '../typer/ressurs';
import { axiosRequest } from './axios';
import { IPerson } from '../typer/person';

interface ISøkPersonIdent {
    personIdent: string;
}

export const hentPersoninfo = (
    id: string,
    innloggetSaksbehandler: ISaksbehandler
): Promise<Ressurs<IPerson>> => {
    return axiosRequest<IPerson, ISøkPersonIdent>(
        {
            method: 'POST',
            url: `/familie-ef-sak/api/personinfo/`,
            data: { personIdent: id },
        },
        innloggetSaksbehandler
    );
};
