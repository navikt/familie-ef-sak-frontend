import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../typer/ressurs';
import { ReglerResponse } from '../komponenter/Behandling/Vurdering/EndreVurderingComponent';

interface HentFagsakResponse {
    hentRegler: () => void;
    regler: Ressurs<ReglerResponse>;
}
export const useHentRegler = (): HentFagsakResponse => {
    const { axiosRequest } = useApp();
    const [regler, settRegler] = useState<Ressurs<ReglerResponse>>(byggTomRessurs());

    const hentRegler = () => {
        settRegler(byggHenterRessurs());
        axiosRequest<ReglerResponse, undefined>({
            method: 'GET',
            url: `/familie-ef-sak/api/regler`,
        }).then((res: Ressurs<ReglerResponse>) => settRegler(res));
    };

    return {
        hentRegler,
        regler,
    };
};
