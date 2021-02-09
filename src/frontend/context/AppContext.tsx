import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import React, { useEffect } from 'react';

import { håndterRessurs, loggFeil, preferredAxios } from '../api/axios';
import { Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { ISaksbehandler } from '../typer/saksbehandler';
import constate from 'constate';
import { GitBackendInfo } from '../typer/gitBackendInfo';

interface IProps {
    autentisertSaksbehandler: ISaksbehandler | undefined;
}

const [AppProvider, useApp] = constate(({ autentisertSaksbehandler }: IProps) => {
    const [autentisert, settAutentisert] = React.useState(true);
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = React.useState(
        autentisertSaksbehandler
    );
    const [gitBackendInfo, settGitBackendInfo] = React.useState<GitBackendInfo>({
        branchName: '',
        commitTime: '',
    });

    useEffect(() => {
        settInnloggetSaksbehandler(autentisertSaksbehandler);
    }, [autentisertSaksbehandler]);

    const oppdaterGitInfo = (headers: any) => {
        const branchName = headers['git-branch'];
        const commitTime = headers['git-commit-time'];
        if (branchName && commitTime) {
            settGitBackendInfo({
                branchName: branchName,
                commitTime: commitTime,
            });
        }
    };

    const axiosRequest = <T, D>(
        config: AxiosRequestConfig & { data?: D }
    ): Promise<RessursFeilet | RessursSuksess<T>> => {
        return preferredAxios
            .request(config)
            .then((response: AxiosResponse<Ressurs<T>>) => {
                oppdaterGitInfo(response.headers);
                const responsRessurs: Ressurs<T> = response.data;
                return håndterRessurs(responsRessurs, innloggetSaksbehandler);
            })
            .catch((error: AxiosError) => {
                if (error.message.includes('401')) {
                    settAutentisert(false);
                }
                loggFeil(error, innloggetSaksbehandler);

                const responsRessurs: Ressurs<T> = error.response?.data;
                return håndterRessurs(responsRessurs, innloggetSaksbehandler);
            });
    };

    return {
        axiosRequest,
        autentisert,
        innloggetSaksbehandler,
        gitBackendInfo,
    };
});

export { AppProvider, useApp };
