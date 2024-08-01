import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { FagsakPerson } from '../typer/fagsak';
import { useApp } from '../context/AppContext';

interface HentFagsakPersonResponse<T> {
    hentFagsakPerson: (fagsakPersonId: string) => void;
    fagsakPerson: Ressurs<T>;
}

export const useHentFagsakPerson = (): HentFagsakPersonResponse<FagsakPerson> => {
    const { axiosRequest } = useApp();
    const [fagsakPerson, settFagsakPerson] = useState<Ressurs<FagsakPerson>>(byggTomRessurs());

    const hentFagsakPerson = useCallback(
        (fagsakPersonid: string) => {
            settFagsakPerson(byggHenterRessurs());
            axiosRequest<FagsakPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/fagsak-person/${fagsakPersonid}`,
            }).then((res: Ressurs<FagsakPerson>) => settFagsakPerson(res));
        },
        [axiosRequest]
    );

    return {
        hentFagsakPerson,
        fagsakPerson,
    };
};
