import React, { useEffect } from 'react';
import { Fagsak } from '../../App/typer/fagsak';
import styled from 'styled-components';
import { formatterEnumVerdi } from '../../App/utils/utils';
import { Systemtittel } from 'nav-frontend-typografi';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { FagsakOvergangsstønad } from './FagsakOvergangsstønad';
import { FagsakBarnetilsyn } from './FagsakBarnetilsyn';
import { useHentFagsakPersonUtvidet } from '../../App/hooks/useHentFagsakPerson';
import DataViewer from '../../Felles/DataViewer/DataViewer';

const StyledEtikettInfo = styled(EtikettInfo)`
    margin-left: 1rem;
`;

const TittelLinje = styled.div`
    margin-top: 1.5rem;
    display: flex;
    align-items: flex-start;
`;

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

export const FagsakTittelLinje: React.FC<{
    fagsak: Fagsak;
}> = ({ fagsak }) => (
    <TittelLinje>
        <Systemtittel tag="h3">Fagsak: {formatterEnumVerdi(fagsak.stønadstype)}</Systemtittel>
        {fagsak.erLøpende && <StyledEtikettInfo mini>Løpende</StyledEtikettInfo>}
    </TittelLinje>
);

export default Behandlingsoversikt;
