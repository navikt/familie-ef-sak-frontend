import { apiLoggFeil, preferredAxios } from '../../../App/api/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { AppEnv } from '../../../App/api/env';

const errorMelding = 'Noe feilet vid henting av link mot a-inntekt';

export const lagAInntektLink = async (appEnv: AppEnv, personIdent: string): Promise<string> => {
    return await preferredAxios
        .get(`${appEnv.aInntekt}/api/v2/redirect/sok/a-inntekt`, {
            headers: {
                'Nav-Personident': personIdent,
            },
        })
        .then((response: AxiosResponse<string>) => {
            return response.data;
        })
        .catch((error: AxiosError<string>) => {
            apiLoggFeil(`${errorMelding} ${error}`);
            return appEnv.aInntekt;
        });
};
