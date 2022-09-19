import React, { useEffect } from 'react';
import { FagsakOversikt } from './FagsakOversikt';
import { useHentFagsakPersonUtvidet } from '../../App/hooks/useHentFagsakPerson';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import KlageInfotrygdInfo from './Klage/KlageInfotrygdInfo';

export enum BehandlingApplikasjon {
    EF_SAK = 'EF_SAK',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

const Behandlingsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPersonUtvidet();

    useEffect(() => {
        hentFagsakPerson(fagsakPersonId);
    }, [hentFagsakPerson, fagsakPersonId]);

    return (
        <DataViewer response={{ fagsakPerson }}>
            {({ fagsakPerson }) => (
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
