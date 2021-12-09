import { preferredAxios } from './axios';

export interface AppEnv {
    aInntekt: string;
}

export const hentEnv = (): Promise<AppEnv> => {
    return preferredAxios.get(`/env`).then((response) => {
        return response.data;
    });
};
