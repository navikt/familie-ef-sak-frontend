import { useEffect } from 'react';
import { erProd } from '../utils/miljø';

export const useStartUmami = () => {
    useEffect(() => {
        const src = erProd()
            ? 'https://cdn.nav.no/team-researchops/sporing/sporing.js'
            : 'https://cdn.nav.no/team-researchops/sporing/sporing-dev.js';
        // TODO: Erstatt med prod-website-id-en som er registrert hos team-researchops for familie-ef-sak-frontend
        const websiteId = erProd()
            ? 'TODO-prod-website-id'
            : 'fee7520e-f090-469e-8b6d-d97319b1f406';

        const script = document.createElement('script');
        script.defer = true;
        script.src = src;
        script.setAttribute('data-website-id', websiteId);

        document.body.appendChild(script);

        return () => {
            try {
                document.body.removeChild(script);
            } catch {
                /* empty */
            }
        };
    }, []);
};
