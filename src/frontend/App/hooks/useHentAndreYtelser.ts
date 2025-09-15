import { byggTomRessurs, Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import { AndreYtelser } from '../typer/andreYtelser';

export const useHentAndreYtelser = (
    fagsakPersonId: string
): {
    hentAndreYtelser: () => void;
    andreYtelser: Ressurs<AndreYtelser>;
} => {
    const { axiosRequest } = useApp();
    const [andreYtelser, settAndreYtelser] = useState<Ressurs<AndreYtelser>>(byggTomRessurs());

    const hentAndreYtelser = useCallback(() => {
        axiosRequest<AndreYtelser, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/andre-ytelser/arbeidsavklaringspenger/${fagsakPersonId}`,
        }).then((response: RessursSuksess<AndreYtelser> | RessursFeilet) => {
            settAndreYtelser(response);
        });
    }, [axiosRequest, fagsakPersonId]);

    return {
        hentAndreYtelser,
        andreYtelser,
    };
};
