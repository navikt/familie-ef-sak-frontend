import React, { useEffect } from 'react';
import { FagsakOvergangsstønad } from './FagsakOvergangsstønad';
import { FagsakBarnetilsyn } from './FagsakBarnetilsyn';
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
                        <FagsakOvergangsstønad
                            fagsak={fagsakPerson.overgangsstønad}
                            rehentFagsak={() => hentFagsakPerson(fagsakPersonId)}
                        />
                    )}
                    {fagsakPerson.barnetilsyn && (
                        <FagsakBarnetilsyn fagsak={fagsakPerson.barnetilsyn} />
                    )}
                </>
            )}
        </DataViewer>
    );
};

export default Behandlingsoversikt;
