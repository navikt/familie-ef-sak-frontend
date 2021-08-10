import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { Stønadstype } from '../typer/behandlingstema';
import { Fagsak } from '../typer/fagsak';

interface HentFagsakResponse {
    hentFagsak: (personIdent: string, stønadstype: Stønadstype) => void;
    fagsak: Ressurs<Fagsak>;
}
export const useHentFagsak = (): HentFagsakResponse => {
    const { axiosRequest } = useApp();
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());

    const hentFagsak = (personIdent: string, stønadstype: Stønadstype) => {
        settFagsak(byggHenterRessurs());
        axiosRequest<Fagsak, { personIdent: string; stønadstype: string }>({
            method: 'POST',
            url: `/familie-ef-sak/api/fagsak`,
            data: { personIdent, stønadstype },
        }).then((res: Ressurs<Fagsak>) => settFagsak(res));
    };

    return {
        hentFagsak,
        fagsak,
    };
};
