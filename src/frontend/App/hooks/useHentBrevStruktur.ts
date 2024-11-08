import { useEffect, useState } from 'react';
import { BrevStruktur, datasett } from '../../Komponenter/Behandling/Brev/BrevTyper';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';

export const useHentBrevStruktur = (
    brevMal: string | undefined
): { brevStruktur: Ressurs<BrevStruktur> } => {
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const { axiosRequest } = useApp();

    const url = `/familie-brev/api/${datasett}/avansert-dokument/bokmaal/${brevMal}/felter/v3`;

    useEffect(() => {
        if (brevMal) {
            axiosRequest<BrevStruktur, null>({
                method: 'GET',
                url: url,
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
