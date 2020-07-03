import { AxiosError } from 'axios';
import React from 'react';
import { byggFeiletRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from './AppContext';
import { ISakListe } from '../typer/saksøk';
import constate from 'constate';

interface IHovedRessurser {
    saker: Ressurs<ISakListe>;
}

const initialState: IHovedRessurser = {
    saker: {
        status: RessursStatus.IKKE_HENTET,
    },
};

const [SakListeProvider, useSakListeRessurser] = constate(() => {
    const [sakerRessurser, settSakerRessurser] = React.useState<IHovedRessurser>(initialState);
    const { axiosRequest } = useApp();

    const hentSakListe = (): void => {
        settSakerRessurser({
            ...sakerRessurser,
            saker: {
                status: RessursStatus.HENTER,
            },
        });
        axiosRequest<ISakListe, void>({
            method: 'GET',
            url: `/familie-ef-sak/api/saksok`,
        })
            .then((hentetSakListe: Ressurs<ISakListe>) => {
                settSakerRessurser({
                    ...sakerRessurser,
                    saker: hentetSakListe,
                });
            })
            .catch((error: AxiosError) => {
                settSakerRessurser({
                    ...sakerRessurser,
                    saker: byggFeiletRessurs('Ukjent ved innhenting av sak', error),
                });
            });
    };

    return {
        hentSakListe,
        ressurser: sakerRessurser,
    };
});

export { SakListeProvider, useSakListeRessurser };
