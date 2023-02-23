import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { AxiosRequestConfig } from 'axios';

export const useHentForrigeInntektsgrunnlag = (
    behandlingId: string
): {
    hentForrigeInntektsgrunnlag: () => void;
    forrigeInntektsgrunnlag: Ressurs<number | undefined>;
} => {
    const { axiosRequest } = useApp();
    const [forrigeInntektsgrunnlag, settForrigeInntektsgrunnlag] = useState<
        Ressurs<number | undefined>
    >(byggTomRessurs());

    const hentForrigeInntektsgrunnlag = useCallback(() => {
        const behandlingConfig: AxiosRequestConfig = {
            method: 'GET',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/forrigeInntektsgrunnlag`,
        };
        axiosRequest<number | undefined, null>(behandlingConfig).then(
            (res: Ressurs<number | undefined>) => {
                settForrigeInntektsgrunnlag(res);
            }
        );
    }, [behandlingId, axiosRequest]);

    return {
        hentForrigeInntektsgrunnlag,
        forrigeInntektsgrunnlag,
    };
};
