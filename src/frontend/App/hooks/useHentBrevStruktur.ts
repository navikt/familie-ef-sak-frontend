import { useEffect, useState } from 'react';
import {
    AlleFlettefelter,
    BrevStruktur,
    DokumentMal,
} from '../../Komponenter/Behandling/Brev/BrevTyper';
import { byggTomRessurs, Ressurs, RessursStatus, RessursSuksess } from '../typer/ressurs';

export const useHentBrevStruktur = (
    brevMal: string | undefined
): { brevStruktur: Ressurs<BrevStruktur> } => {
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    // const { axiosRequest } = useApp();

    // const url = `/familie-brev/api/${datasett}/avansert-dokument/bokmaal/${brevMal}/felter/v3`;

    const dummyAlleFlettefelter: AlleFlettefelter = {
        flettefeltReferanse: [],
    };

    const dummyDokumentMal: DokumentMal = {
        brevmenyBlokker: [],
    };

    const dummyBrevstruktur: BrevStruktur = {
        dokument: dummyDokumentMal,
        flettefelter: dummyAlleFlettefelter,
    };

    const dummyRessursMedBrevstruktur: RessursSuksess<BrevStruktur> = {
        data: dummyBrevstruktur,
        status: RessursStatus.SUKSESS,
    };

    useEffect(() => {
        // if (brevMal) {
        //     axiosRequest<BrevStruktur, null>({
        //         method: 'GET',
        //         url: url,
        //     }).then((respons: Ressurs<BrevStruktur>) => {
        //         settBrevStruktur(respons);
        //     });
        // }
        settBrevStruktur(dummyRessursMedBrevstruktur);
        // eslint-disable-next-line
    }, [brevMal]);

    return {
        brevStruktur,
    };
};
