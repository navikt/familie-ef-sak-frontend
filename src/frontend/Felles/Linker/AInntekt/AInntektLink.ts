import { preferredAxios } from '../../../App/api/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { AppEnv } from '../../../App/api/env';

export const lagAInntektLink = async (appEnv: AppEnv, personIdent: string): Promise<string> => {
    return await preferredAxios
        .post(`/api/generer-ainmtekt-url`, {
            ident: personIdent,
        })
        .then((response: AxiosResponse<string>) => {
            return response.data;
        })
        .catch((_: AxiosError<string>) => {
            return appEnv.aInntekt;
        });
};
