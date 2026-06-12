import { AxiosError } from 'axios';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { AxiosRequestCallback } from '../../App/typer/axiosRequest';

export const lagAInntektLink = async (
    axiosRequest: AxiosRequestCallback,
    fagsakId: string | undefined,
    fagsakPersonId: string | undefined
): Promise<string | null> => {
    const url = fagsakPersonId
        ? `/familie-ef-sak/api/inntekt/fagsak-person/${fagsakPersonId}/generer-url`
        : `/familie-ef-sak/api/inntekt/fagsak/${fagsakId}/generer-url`;
    return await axiosRequest<string, null>({
        method: 'GET',
        url: url,
    })
        .then((response: Ressurs<string>) => {
            if (response.status === RessursStatus.SUKSESS) {
                return response.data;
            }
            console.error('Klarte ikke generere A-inntekt-lenke', url, response);
            return null;
        })
        .catch((error: AxiosError<string>) => {
            console.error('Klarte ikke generere A-inntekt-lenke', url, error);
            return null;
        });
};

export const lagArbeidsforholdLink = async (
    axiosRequest: AxiosRequestCallback,
    fagsakId: string | undefined
): Promise<string | null> => {
    const url = `/familie-ef-sak/api/inntekt/fagsak/${fagsakId}/generer-url-arbeidsforhold`;
    return await axiosRequest<string, null>({
        method: 'GET',
        url: url,
    })
        .then((response: Ressurs<string>) => {
            if (response.status === RessursStatus.SUKSESS) {
                return response.data;
            }
            console.error('Klarte ikke generere arbeidsforhold lenke', url, response);
            return null;
        })
        .catch((error: AxiosError<string>) => {
            console.error('Klarte ikke generere arbeidsforhold lenke', url, error);
            return null;
        });
};
