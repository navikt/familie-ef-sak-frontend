import {
    IFagsak,
    Behandlingstype,
    BehandlingKategori,
    BehandlingUnderkategori,
    VedtakResultat,
} from '../typer/fagsak';
import { Ressurs } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';
import { axiosRequest } from './axios';

export const hentFagsak = (
    id: string,
    innloggetSaksbehandler?: ISaksbehandler
): Promise<Ressurs<IFagsak>> => {
    return axiosRequest<IFagsak>(
        {
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak/${id}`,
        },
        innloggetSaksbehandler
    );
};

export const hentFagsaker = (
    filter: string,
    innloggetSaksbehandler?: ISaksbehandler
): Promise<Ressurs<IFagsak[]>> => {
    return axiosRequest(
        {
            headers: {
                filter,
            },
            method: 'GET',
            url: '/familie-ef-sak/api/fagsak',
        },
        innloggetSaksbehandler
    );
};

export interface IOpprettBehandlingData {
    barnasIdenter: string[];
    behandlingType: Behandlingstype;
    ident: string;
    kategori: BehandlingKategori;
    underkategori: BehandlingUnderkategori;
}

export const apiOpprettBehandling = (data: IOpprettBehandlingData) => {
    return axiosRequest<IFagsak>({
        data,
        method: 'POST',
        url: '/familie-ef-sak/api/behandling/opprett',
    });
};

export interface IOpprettVedtakData {
    resultat: VedtakResultat;
    begrunnelse: string;
}

export const apiOpprettVedtak = (fagsakId: number, data: IOpprettVedtakData) => {
    return axiosRequest<IFagsak>({
        data,
        method: 'POST',
        url: `/familie-ef-sak/api/fagsak/${fagsakId}/nytt-vedtak`,
    });
};

export const apiOpprettBeregning = (fagsakId: number, data: any) => {
    return axiosRequest<IFagsak>({
        data,
        method: 'POST',
        url: `/familie-ef-sak/api/fagsak/${fagsakId}/oppdater-vedtak-beregning`,
    });
};
