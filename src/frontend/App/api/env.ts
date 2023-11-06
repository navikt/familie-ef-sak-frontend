import { preferredAxios } from './axios';
import { Roller } from '../utils/roller';

export interface AppEnv {
    aInntekt: string;
    gosys: string;
    modia: string;
    drek: string;
    historiskPensjon: string;
    roller: Roller;
}

export const hentEnv = (): Promise<AppEnv> => {
    return preferredAxios.get(`/env`).then((response) => {
        return response.data;
    });
};
