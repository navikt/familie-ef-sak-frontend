import React from 'react';
import { Fagsak } from '../../App/typer/fagsak';
import { formatterEnumVerdi } from '../../App/utils/utils';
import { Heading, HStack, Tag } from '@navikt/ds-react';
import { BodyShortSmall } from '../../Felles/Visningskomponenter/Tekster';

export const FagsakTittelLinje: React.FC<{
    fagsak: Fagsak;
}> = ({ fagsak }) => (
    <HStack align={'center'} gap={'space-8'}>
        <Heading size={'small'} level="3">
            Fagsak: {formatterEnumVerdi(fagsak.stønadstype)}
        </Heading>
        <BodyShortSmall>({fagsak.eksternId})</BodyShortSmall>
        {fagsak.erLøpende && (
            <Tag variant={'info'} size={'small'}>
                Løpende
            </Tag>
        )}
    </HStack>
);
