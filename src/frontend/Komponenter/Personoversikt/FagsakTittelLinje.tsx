import styled from 'styled-components';
import React from 'react';
import { Fagsak } from '../../App/typer/fagsak';
import { Systemtittel } from 'nav-frontend-typografi';
import { formatterEnumVerdi } from '../../App/utils/utils';
import { EtikettInfo } from 'nav-frontend-etiketter';

const StyledEtikettInfo = styled(EtikettInfo)`
    margin-left: 1rem;
`;
const TittelLinje = styled.div`
    margin-top: 1.5rem;
    display: flex;
    align-items: flex-start;
`;
export const FagsakTittelLinje: React.FC<{
    fagsak: Fagsak;
}> = ({ fagsak }) => (
    <TittelLinje>
        <Systemtittel tag="h3">Fagsak: {formatterEnumVerdi(fagsak.stønadstype)}</Systemtittel>
        {fagsak.erLøpende && <StyledEtikettInfo mini>Løpende</StyledEtikettInfo>}
    </TittelLinje>
);
