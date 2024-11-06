import { useEffect, useState } from 'react';
import { BrevStruktur, datasett } from '../../Komponenter/Behandling/Brev/BrevTyper';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { ToggleName } from '../context/toggles';
import { useToggles } from '../context/TogglesContext';

export const useHentBrevStruktur = (
    brevMal: string | undefined
): { brevStruktur: Ressurs<BrevStruktur> } => {
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const felterVersion = toggles[ToggleName.brukBrevEndepunktFelterV2] ? `/v3` : '';
    const url = `/familie-brev/api/${datasett}/avansert-dokument/bokmaal/${brevMal}/felter${felterVersion}`;

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
