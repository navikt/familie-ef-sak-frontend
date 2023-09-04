import { useCallback, useEffect, useState } from 'react';

import createUseContext from 'constate';
import { Toggles } from './toggles';
import axios, { AxiosResponse } from 'axios';

const [TogglesProvider, useToggles] = createUseContext(() => {
    const [toggles, settToggles] = useState<Toggles>({});
    TogglesProvider.displayName = 'TOGGLES_PROVIDER';

    const fetchToggles = useCallback(() => {
        const hentToggles = () => {
            return axios.get(`/familie-ef-sak/api/featuretoggle`, {
                withCredentials: true,
            });
        };

        hentToggles()
            .then((resp: AxiosResponse<Toggles>) => settToggles(resp.data))
            .catch((err: Error) => {
                // eslint-disable-next-line no-console
                console.log('Kunne ikke hente toggles, ' + err.message);
            });
    }, []);

    useEffect(() => {
        fetchToggles();
    }, [fetchToggles]);

    return { toggles };
});

const [TogglesUnleashNextProvider, useUnleashNextToggles] = createUseContext(() => {
    const [togglesUnleashNext, settUnleashNextToggles] = useState<Toggles>({});
    TogglesUnleashNextProvider.displayName = 'TOGGLES_UNLEASH_NEXT_PROVIDER';

    const fetchUnleashNextToggles = useCallback(() => {
        const hentToggles = () => {
            return axios.get(`/familie-ef-sak/api/featuretogglenext`, {
                withCredentials: true,
            });
        };

        hentToggles()
            .then((resp: AxiosResponse<Toggles>) => settUnleashNextToggles(resp.data))
            .catch((err: Error) => {
                // eslint-disable-next-line no-console
                console.log('Kunne ikke hente toggles, ' + err.message);
            });
    }, []);

    useEffect(() => {
        fetchUnleashNextToggles();
    }, [fetchUnleashNextToggles]);

    return { togglesUnleashNext };
});

export { TogglesUnleashNextProvider, useUnleashNextToggles };
export { TogglesProvider, useToggles };
