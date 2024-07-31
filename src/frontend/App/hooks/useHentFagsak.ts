import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { Stønadstype } from '../typer/behandlingstema';
import { Fagsak } from '../typer/fagsak';

interface HentFagsakResponse {
    hentFagsakPåPersonIdent: (personIdent: string, stønadstype: Stønadstype) => void;
    fagsakPåPersonIdent: Ressurs<Fagsak>;
    hentFagsak: (fagsakId: string) => void;
    fagsak: Ressurs<Fagsak>;
}

export const useHentFagsak = (): HentFagsakResponse => {
    const { axiosRequest } = useApp();
    const [fagsakPåPersonIdent, settFagsakPåPersonIdent] =
        useState<Ressurs<Fagsak>>(byggTomRessurs());
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());

    const hentFagsakPåPersonIdent = useCallback(
        (personIdent: string, stønadstype: Stønadstype) => {
            settFagsakPåPersonIdent(byggHenterRessurs());
            axiosRequest<Fagsak, { personIdent: string; stønadstype: string }>({
                method: 'POST',
                url: `/familie-ef-sak/api/fagsak`,
                data: { personIdent, stønadstype },
            }).then((res: Ressurs<Fagsak>) => settFagsakPåPersonIdent(res));
        },
        [axiosRequest]
    );

    const hentFagsak = useCallback(
        (fagsakId: string) => {
            settFagsak(byggHenterRessurs());
            axiosRequest<Fagsak, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/fagsak/${fagsakId}`,
            }).then((res: Ressurs<Fagsak>) => settFagsak(res));
        },
        [axiosRequest]
    );

    return {
        hentFagsakPåPersonIdent,
        fagsakPåPersonIdent,
        fagsak,
        hentFagsak,
    };
};
