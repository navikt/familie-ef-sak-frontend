import { AxiosRequestConfig } from 'axios';
import { RessursFeilet, RessursSuksess } from './ressurs';

export type AxiosRequestCallback = <RES, REQ>(
    config: AxiosRequestConfig & { data?: REQ }
) => Promise<RessursFeilet | RessursSuksess<RES>>;
