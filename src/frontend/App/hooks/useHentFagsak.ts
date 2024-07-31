import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { Stønadstype } from '../typer/behandlingstema';
import { Fagsak } from '../typer/fagsak';

interface HentFagsakResponse {
    hentFagsakPåPersonIdent: (personIdent: string, stønadstype: Stønadstype) => void;
    fagsakPåPersonIdent: Ressurs<Fagsak>;
    hentFagsakPåBehandlingId: (behandlingId: string) => void;
    fagsakPåBehandlingId: Ressurs<Fagsak>;
}

export const useHentFagsak = (): HentFagsakResponse => {
    const { axiosRequest } = useApp();
    const [fagsakPåPersonIdent, settFagsakPåPersonIdent] =
        useState<Ressurs<Fagsak>>(byggTomRessurs());
    const [fagsakPåBehandlingId, settFagsakPåBehandlingId] =
        useState<Ressurs<Fagsak>>(byggTomRessurs());

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

    const hentFagsakPåBehandlingId = useCallback(
        (behandlingId: string) => {
            settFagsakPåBehandlingId(byggHenterRessurs());
            axiosRequest<Fagsak, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/fagsak/behandling/${behandlingId}`,
            }).then((res: Ressurs<Fagsak>) => settFagsakPåBehandlingId(res));
        },
        [axiosRequest]
    );

    return {
        hentFagsakPåPersonIdent,
        fagsakPåPersonIdent,
        hentFagsakPåBehandlingId,
        fagsakPåBehandlingId,
    };
};
