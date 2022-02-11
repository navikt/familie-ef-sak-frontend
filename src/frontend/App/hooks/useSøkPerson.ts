import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { ISøkPerson } from '../typer/personsøk';
import { IPersonIdent } from '../typer/felles';
import { useApp } from '../context/AppContext';

interface HentSøkPersonResponse {
    hentSøkPerson: (personIdent: string) => void;
    søkPersonResponse: Ressurs<ISøkPerson>;
}
export const useHentSøkPerson = (): HentSøkPersonResponse => {
    const { axiosRequest } = useApp();
    const [response, settResponse] = useState<Ressurs<ISøkPerson>>(byggTomRessurs());

    const hentSøkPerson = useCallback(
        (personIdent: string) => {
            settResponse(byggHenterRessurs());
            axiosRequest<ISøkPerson, IPersonIdent>({
                method: 'POST',
                url: `/familie-ef-sak/api/sok/`,
                data: { personIdent: personIdent },
            }).then((res: Ressurs<ISøkPerson>) => settResponse(res));
        },
        [axiosRequest]
    );

    return {
        hentSøkPerson,
        søkPersonResponse: response,
    };
};
