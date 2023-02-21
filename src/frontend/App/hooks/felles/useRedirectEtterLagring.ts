import { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

/**
 * Denne trengs fordi vi bruker react-router-prompt for å sperre for å navigere når man har ulagret data.
 * Den sperren gjør at vi heller ikke klarer å navigere videre etter lagring og nullstilling av ulagret data.
 * For å omgå sperren må vi vente på at ulagretData er satt til false samtidig som vi sier at vi ønsker å navigere videre.
 * Dette fungerer ikke inni komponenten, så vi må ha denne hooken for å omgå problemet.
 * @param url til siden brukeren skal redirectes til
 */
export const useRedirectEtterLagring = (url: string) => {
    const navigate = useNavigate();
    const { ulagretData } = useApp();
    const [redirect, settRedirect] = useState(false);
    useEffect(() => {
        if (redirect && !ulagretData) {
            navigate(url);
        }
    }, [redirect, ulagretData, navigate, url]);

    return {
        utførRedirect: () => {
            settRedirect(true);
        },
    };
};
