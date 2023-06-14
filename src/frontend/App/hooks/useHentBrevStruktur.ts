import { useEffect, useState } from 'react';
import { BrevStruktur, datasett, fritekstmal } from '../../Komponenter/Behandling/Brev/BrevTyper';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';

export const useHentBrevStruktur = (
    brevMal: string | undefined
): { brevStruktur: Ressurs<BrevStruktur> } => {
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const { axiosRequest } = useApp();

    useEffect(() => {
        if (brevMal && brevMal !== fritekstmal) {
            axiosRequest<BrevStruktur, null>({
                method: 'GET',
                url: `/familie-brev/api/${datasett}/avansert-dokument/bokmaal/${brevMal}/felter`,
            }).then((respons: Ressurs<BrevStruktur>) => {
                settBrevStruktur(respons);
            });
        }
        // eslint-disable-next-line
    }, [brevMal]);

    return {
        brevStruktur,
    };
};
