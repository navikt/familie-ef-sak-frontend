import { Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { AxiosRequestConfig } from 'axios';

export enum EFinnesKontantstøtteUtbetaling {
    JA = 'JA',
    NEI = 'NEI',
    UKJENT = 'UKJENT',
}

type IKontantstøtteUtbetaling = {
    finnesUtbetaling: boolean;
};

export const useHentKontantstøtteUtbetaling = (): {
    finnesKontantstøtteUtbetaling: EFinnesKontantstøtteUtbetaling;
    hentKontantstøtteUtbetaling: (behandlingId: string) => void;
} => {
    const { axiosRequest } = useApp();
    const [finnesKontantstøtteUtbetaling, settFinnesKontantstøtteUtbetaling] =
        useState<EFinnesKontantstøtteUtbetaling>(EFinnesKontantstøtteUtbetaling.UKJENT);

    const hentKontantstøtteUtbetaling = useCallback(
        (behandlingId: string) => {
            const kontantstøtteUtbetalingConfig: AxiosRequestConfig = {
                method: 'GET',
                url: `/familie-ef-sak/api/behandling/kontantstotte/${behandlingId}/finnesUtbetalinger`,
            };
            axiosRequest<IKontantstøtteUtbetaling, null>(kontantstøtteUtbetalingConfig).then(
                (res: Ressurs<IKontantstøtteUtbetaling>) =>
                    res.status === RessursStatus.SUKSESS && res.data.finnesUtbetaling
                        ? settFinnesKontantstøtteUtbetaling(EFinnesKontantstøtteUtbetaling.JA)
                        : settFinnesKontantstøtteUtbetaling(EFinnesKontantstøtteUtbetaling.NEI)
            );
        },
        [axiosRequest]
    );

    return {
        finnesKontantstøtteUtbetaling,
        hentKontantstøtteUtbetaling,
    };
};
