import { Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';

export enum EFinnesKontantstøtteUtbetaling {
    JA = 'JA',
    NEI = 'NEI',
    UKJENT = 'UKJENT',
}

type IKontantstøtteUtbetaling = {
    finnesUtbetaling: boolean;
};

export const useHentKontantstøtteUtbetaling = (
    behandlingId: string
): {
    finnesKontantstøtteUtbetaling: EFinnesKontantstøtteUtbetaling;
} => {
    const { axiosRequest } = useApp();
    const [finnesKontantstøtteUtbetaling, settFinnesKontantstøtteUtbetaling] =
        useState<EFinnesKontantstøtteUtbetaling>(EFinnesKontantstøtteUtbetaling.UKJENT);

    useEffect(() => {
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
    }, [axiosRequest, behandlingId]);

    return {
        finnesKontantstøtteUtbetaling,
    };
};
