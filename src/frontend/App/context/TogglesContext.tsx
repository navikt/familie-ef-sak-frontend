import React, { createContext, useCallback, useEffect, useState } from 'react';
import { Toggles } from './toggles';
import axios, { AxiosResponse } from 'axios';

type TogglesContextType = { toggles: Toggles };

const TogglesContext = createContext<TogglesContextType | undefined>(undefined);

export const TogglesProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
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
                console.log('Kunne ikke hente toggles, ' + err.message);
            });
    }, []);

    useEffect(() => {
        fetchToggles();
    }, [fetchToggles]);

    return <TogglesContext.Provider value={{ toggles }}>{children}</TogglesContext.Provider>;
};

export const useToggles = (): TogglesContextType => {
    const context = React.useContext(TogglesContext);
    if (context === undefined) {
        throw new Error('useTogglesContext kan ikke brukes utenfor TogglesContextProvider');
    }
    return context;
};
