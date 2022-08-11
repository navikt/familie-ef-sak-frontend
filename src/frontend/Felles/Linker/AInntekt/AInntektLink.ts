import { AxiosError } from 'axios';
import { AppEnv } from '../../../App/api/env';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { AxiosRequestCallback } from '../../../App/typer/axiosRequest';

export const lagAInntektLink = async (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string | undefined,
    fagsakPersonId: string | undefined
): Promise<string> => {
    const url = fagsakPersonId
        ? `/familie-ef-sak/api/inntekt/fagsak-person/${fagsakPersonId}/generer-url`
        : `/familie-ef-sak/api/inntekt/fagsak/${fagsakId}/generer-url`;
    return await axiosRequest<string, null>({
        method: 'GET',
        url: url,
    })
        .then((response: Ressurs<string>) => {
            return response.status === RessursStatus.SUKSESS ? response.data : appEnv.aInntekt;
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((_: AxiosError<string>) => {
            return appEnv.aInntekt;
        });
};
