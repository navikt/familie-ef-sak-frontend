import { preferredAxios } from './axios';
import { Roller } from '../utils/roller';

export interface AppEnv {
    aInntekt: string;
    gosys: string;
    roller: Roller;
}

export const hentEnv = (): Promise<AppEnv> => {
    return preferredAxios.get(`/env`).then((response) => {
        return response.data;
    });
};
