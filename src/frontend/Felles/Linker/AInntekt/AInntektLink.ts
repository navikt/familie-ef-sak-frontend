import { AxiosError } from 'axios';
import { AppEnv } from '../../../App/api/env';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { AxiosRequestCallback } from '../../../App/typer/axiosRequest';

export const lagAInntektLink = async (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string
): Promise<string> => {
    return await axiosRequest<string, null>({
        method: 'GET',
        url: `/familie-ef-sak/api/inntekt/fagsak/${fagsakId}/generer-url`,
    })
        .then((response: Ressurs<string>) => {
            return response.status === RessursStatus.SUKSESS ? response.data : appEnv.aInntekt;
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((_: AxiosError<string>) => {
            return appEnv.aInntekt;
        });
};
