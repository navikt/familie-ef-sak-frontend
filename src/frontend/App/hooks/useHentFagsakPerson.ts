import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { IFagsakPerson, IFagsakPersonMedBehandlinger } from '../typer/fagsak';
import { useApp } from '../context/AppContext';

interface HentFagsakPersonResponse<T> {
    hentFagsakPerson: (fagsakPersonId: string) => void;
    fagsakPerson: Ressurs<T>;
}
export const useHentFagsakPerson = (): HentFagsakPersonResponse<IFagsakPerson> => {
    const { axiosRequest } = useApp();
    const [fagsakPerson, settFagsakPerson] = useState<Ressurs<IFagsakPerson>>(byggTomRessurs());

    const hentFagsakPerson = useCallback(
        (fagsakPersonid: string) => {
            settFagsakPerson(byggHenterRessurs());
            axiosRequest<IFagsakPerson, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/fagsak-person/${fagsakPersonid}`,
            }).then((res: Ressurs<IFagsakPerson>) => settFagsakPerson(res));
        },
        [axiosRequest]
    );

    return {
        hentFagsakPerson,
        fagsakPerson: fagsakPerson,
    };
};

export const useHentFagsakPersonUtvidet =
    (): HentFagsakPersonResponse<IFagsakPersonMedBehandlinger> => {
        const { axiosRequest } = useApp();
        const [fagsakPerson, settFagsakPerson] = useState<Ressurs<IFagsakPersonMedBehandlinger>>(
            byggTomRessurs()
        );

        const hentFagsakPerson = useCallback(
            (fagsakPersonid: string) => {
                settFagsakPerson(byggHenterRessurs());
                axiosRequest<IFagsakPersonMedBehandlinger, null>({
                    method: 'GET',
                    url: `/familie-ef-sak/api/fagsak-person/${fagsakPersonid}/utvidet`,
                }).then((res: Ressurs<IFagsakPersonMedBehandlinger>) => settFagsakPerson(res));
            },
            [axiosRequest]
        );

        return {
            hentFagsakPerson,
            fagsakPerson,
        };
    };
