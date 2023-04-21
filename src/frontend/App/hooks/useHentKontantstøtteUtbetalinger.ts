import { Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';

export enum FinnesKontantstøtteUtbetaling {
    JA = 'JA',
    NEI = 'NEI',
    UKJENT = 'UKJENT',
}

type KontantstøtteUtbetaling = {
    finnesUtbetaling: boolean;
};

export const useHentKontantstøtteUtbetaling = (
    behandlingId: string
): {
    finnesKontantstøtteUtbetaling: FinnesKontantstøtteUtbetaling;
} => {
    const { axiosRequest } = useApp();
    const [finnesKontantstøtteUtbetaling, settFinnesKontantstøtteUtbetaling] =
        useState<FinnesKontantstøtteUtbetaling>(FinnesKontantstøtteUtbetaling.UKJENT);

    useEffect(() => {
        const kontantstøtteUtbetalingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-ef-sak/api/behandling/kontantstotte/${behandlingId}/finnesUtbetalinger`,
        };
        axiosRequest<KontantstøtteUtbetaling, null>(kontantstøtteUtbetalingConfig).then(
            (res: Ressurs<KontantstøtteUtbetaling>) =>
                res.status === RessursStatus.SUKSESS && res.data.finnesUtbetaling
                    ? settFinnesKontantstøtteUtbetaling(FinnesKontantstøtteUtbetaling.JA)
                    : settFinnesKontantstøtteUtbetaling(FinnesKontantstøtteUtbetaling.NEI)
        );
    }, [axiosRequest, behandlingId]);

    return {
        finnesKontantstøtteUtbetaling,
    };
};
