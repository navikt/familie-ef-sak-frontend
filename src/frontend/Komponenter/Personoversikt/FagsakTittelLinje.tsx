import styled from 'styled-components';
import React from 'react';
import { Fagsak } from '../../App/typer/fagsak';
import { formatterEnumVerdi } from '../../App/utils/utils';
import { Heading, Tag } from '@navikt/ds-react';
import { BodyShortSmall } from '../../Felles/Visningskomponenter/Tekster';

const StyledTag = styled(Tag)`
    margin-left: 1rem;
`;
const TittelLinje = styled.div`
    margin-top: 1.5rem;
    display: flex;
    align-items: flex-start;
`;

const TekstMedMargin = styled(BodyShortSmall)`
    margin-top: 0.3rem;
    margin-left: 0.3rem;
`;

export const FagsakTittelLinje: React.FC<{
    fagsak: Fagsak;
}> = ({ fagsak }) => (
    <TittelLinje>
        <Heading size={'small'} level="3">
            Fagsak: {formatterEnumVerdi(fagsak.stønadstype)}
        </Heading>
        <TekstMedMargin>({fagsak.eksternId})</TekstMedMargin>
        {fagsak.erLøpende && (
            <StyledTag variant={'info'} size={'small'}>
                Løpende
            </StyledTag>
        )}
    </TittelLinje>
);
