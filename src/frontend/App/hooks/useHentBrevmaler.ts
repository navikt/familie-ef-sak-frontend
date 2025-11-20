import { useEffect, useState } from 'react';
import { datasett, DokumentNavn } from '../../Komponenter/Behandling/Brev/BrevTyper';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { ToggleName } from '../context/toggles';
import { useToggles } from '../context/TogglesContext';

export const useHentBrevmaler = (): { brevmaler: Ressurs<DokumentNavn[]> } => {
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const [brevmaler, settBrevmaler] = useState<Ressurs<DokumentNavn[]>>(byggTomRessurs());

    useEffect(() => {
        const skalViseUpubliserteMaler = toggles[ToggleName.visIkkePubliserteBrevmaler] || false;

        axiosRequest<DokumentNavn[], null>({
            method: 'GET',
            url: `/familie-brev/api/${datasett}/avansert-dokument/navn/${skalViseUpubliserteMaler}`,
        }).then((respons: Ressurs<DokumentNavn[]>) => {
            settBrevmaler(respons);
        });
    }, []);

    return {
        brevmaler,
    };
};
