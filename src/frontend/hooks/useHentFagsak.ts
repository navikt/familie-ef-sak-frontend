import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { Stønadstype } from '../typer/behandlingstema';
import { Fagsak } from '../typer/fagsak';
import { BrukerInfo } from '../typer/journalforing';

export const useHentFagsak = () => {
    const { axiosRequest, innloggetSaksbehandler } = useApp();
    const [fagsak, settFagsak] = useState<Ressurs<Fagsak>>(byggTomRessurs());

    const hentFagsak = (bruker: BrukerInfo, stønadstype: Stønadstype) => {
        settFagsak(byggHenterRessurs());
        axiosRequest<Fagsak, { bruker: BrukerInfo; stønadstype: string }>(
            {
                method: 'POST',
                url: `/familie-ef-sak/api/fagsak`,
                data: { bruker, stønadstype },
            },
            innloggetSaksbehandler
        ).then((res: Ressurs<Fagsak>) => settFagsak(res));
    };

    return {
        hentFagsak,
        fagsak,
    };
};
