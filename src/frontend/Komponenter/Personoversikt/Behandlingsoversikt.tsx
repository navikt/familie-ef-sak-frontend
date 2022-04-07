import React, { useEffect } from 'react';
import { FagsakOversikt } from './FagsakOversikt';
import { useHentFagsakPersonUtvidet } from '../../App/hooks/useHentFagsakPerson';
import DataViewer from '../../Felles/DataViewer/DataViewer';

export enum BehandlingApplikasjon {
    EF_SAK = 'EF_SAK',
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
                    {fagsakPerson.overgangsstønad && (
                        <FagsakOversikt fagsak={fagsakPerson.overgangsstønad} />
                    )}
                    {fagsakPerson.barnetilsyn && (
                        <FagsakOversikt fagsak={fagsakPerson.barnetilsyn} />
                    )}
                </>
            )}
        </DataViewer>
    );
};

export default Behandlingsoversikt;
