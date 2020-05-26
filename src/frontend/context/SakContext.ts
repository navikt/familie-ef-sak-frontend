import { AxiosError } from 'axios';
import React from 'react';
import { byggFeiletRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { useApp } from './AppContext';
import { ISak } from '../typer/sak';
import constate from 'constate';
import { ISaksøk } from '../typer/saksøk';

interface IHovedRessurser {
    saksøk: Ressurs<ISaksøk>;
    sak: Ressurs<ISak>;
}

interface ISøkPersonIdent {
    personIdent: string;
}

const initialState: IHovedRessurser = {
    saksøk: {
        status: RessursStatus.IKKE_HENTET,
    },
    sak: {
        status: RessursStatus.IKKE_HENTET,
    },
};

const [SakProvider, useSakRessurser] = constate(() => {
    const [sakRessurser, settSakRessurser] = React.useState<IHovedRessurser>(initialState);
    const { axiosRequest } = useApp();

    React.useEffect(() => {
        if (sakRessurser.sak.status === RessursStatus.SUKSESS) {
            settSakRessurser({
                ...sakRessurser,
                saksøk: {
                    status: RessursStatus.HENTER,
                },
            });
            axiosRequest<ISaksøk, ISøkPersonIdent>({
                method: 'POST',
                url: '/familie-ef-sak/api/saksoek/ident',
                data: {
                    personIdent: sakRessurser.sak.data.søknad.personalia.verdi.fødselsnummer.verdi,
                },
            }).then((sakSøkRessurs: Ressurs<ISaksøk>) => {
                settSakRessurser({
                    ...sakRessurser,
                    saksøk: sakSøkRessurs,
                });
            });
        }
    }, [sakRessurser.sak.status]);

    const hentSak = (sakId: string): void => {
        settSakRessurser({
            ...sakRessurser,
            sak: {
                status: RessursStatus.HENTER,
            },
        });
        axiosRequest<ISak, void>({
            method: 'GET',
            url: `/familie-ef-sak/api/sak/${sakId}`,
        })
            .then((hentetFagsak: Ressurs<ISak>) => {
                settSakRessurser({
                    ...sakRessurser,
                    sak: hentetFagsak,
                });
            })
            .catch((error: AxiosError) => {
                settSakRessurser({
                    ...sakRessurser,
                    sak: byggFeiletRessurs('Ukjent ved innhenting av sak', error),
                });
            });
    };

    const settSak = (modifisertSak: Ressurs<ISak>): void =>
        settSakRessurser({ ...sakRessurser, sak: modifisertSak });

    return {
        hentSak,
        ressurser: sakRessurser,
        settSak,
    };
});

export { SakProvider, useSakRessurser };
