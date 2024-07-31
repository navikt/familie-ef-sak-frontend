import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { FagsakPersonMedBehandlinger } from '../typer/fagsak';
import { useApp } from '../context/AppContext';

interface HentFagsakPersonResponse<T> {
    hentFagsakPerson: (fagsakPersonId: string) => void;
    fagsakPerson: Ressurs<T>;
}

export const useHentFagsakPersonUtvidet =
    (): HentFagsakPersonResponse<FagsakPersonMedBehandlinger> => {
        const { axiosRequest } = useApp();
        const [fagsakPerson, settFagsakPerson] =
            useState<Ressurs<FagsakPersonMedBehandlinger>>(byggTomRessurs());

        const hentFagsakPerson = useCallback(
            (fagsakPersonid: string) => {
                settFagsakPerson(byggHenterRessurs());
                axiosRequest<FagsakPersonMedBehandlinger, null>({
                    method: 'GET',
                    url: `/familie-ef-sak/api/fagsak-person/${fagsakPersonid}/utvidet`,
                }).then((res: Ressurs<FagsakPersonMedBehandlinger>) => settFagsakPerson(res));
            },
            [axiosRequest]
        );

        return {
            hentFagsakPerson,
            fagsakPerson,
        };
    };
