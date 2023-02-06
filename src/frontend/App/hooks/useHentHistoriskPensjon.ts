import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { IHistoriskPensjon } from '../typer/historiskpensjon';

export const useHentHistoriskPensjon = (): {
    hentForFagsakId: (fagsakId: string) => void;
    hentForFagsakPersonId: (fagsakPersonId: string) => void;
    historiskPensjon: Ressurs<IHistoriskPensjon>;
} => {
    const { axiosRequest } = useApp();
    const [response, settResponse] = useState<Ressurs<IHistoriskPensjon>>(byggTomRessurs());

    const hentForFagsakPersonId = useCallback(
        (fagsakPersonId: string) => {
            settResponse(byggHenterRessurs());
            axiosRequest<IHistoriskPensjon, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/historiskpensjon/${fagsakPersonId}`,
            }).then((res: Ressurs<IHistoriskPensjon>) => settResponse(res));
        },
        [axiosRequest]
    );

    const hentForFagsakId = useCallback(
        (fagsakId: string) => {
            settResponse(byggHenterRessurs());
            axiosRequest<IHistoriskPensjon, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/historiskpensjon/fagsak/${fagsakId}`,
            }).then((res: Ressurs<IHistoriskPensjon>) => settResponse(res));
        },
        [axiosRequest]
    );

    return {
        hentForFagsakId,
        hentForFagsakPersonId,
        historiskPensjon: response,
    };
};
