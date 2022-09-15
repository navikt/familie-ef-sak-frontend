import React, { useEffect } from 'react';
import { FagsakOversikt } from './FagsakOversikt';
import { useHentFagsakPersonUtvidet } from '../../App/hooks/useHentFagsakPerson';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import KlageInfotrygdInfo from './Klage/KlageInfotrygdInfo';
import { useHentKlagebehandlinger } from '../../App/hooks/useHentKlagebehandlinger';

export enum BehandlingApplikasjon {
    EF_SAK = 'EF_SAK',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

const Behandlingsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPersonUtvidet();
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();

    useEffect(() => {
        hentFagsakPerson(fagsakPersonId);
        hentKlagebehandlinger(fagsakPersonId);
    }, [hentFagsakPerson, fagsakPersonId]);

    return (
        <DataViewer response={{ fagsakPerson, klagebehandlinger }}>
            {({ fagsakPerson, klagebehandlinger }) => (
                <>
                    <KlageInfotrygdInfo fagsakPersonId={fagsakPersonId} />
                    {fagsakPerson.overgangsstønad && (
                        <FagsakOversikt fagsak={fagsakPerson.overgangsstønad} />
                    )}
                    {fagsakPerson.barnetilsyn && (
                        <FagsakOversikt fagsak={fagsakPerson.barnetilsyn} />
                    )}
                    {fagsakPerson.skolepenger && (
                        <FagsakOversikt fagsak={fagsakPerson.skolepenger} />
                    )}
                </>
            )}
        </DataViewer>
    );
};

export default Behandlingsoversikt;
