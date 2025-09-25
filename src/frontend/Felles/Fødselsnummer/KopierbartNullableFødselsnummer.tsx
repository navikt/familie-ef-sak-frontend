import React from 'react';
import { formaterFødselsnummer } from '../../App/utils/formatter';
import { CopyButton, HStack } from '@navikt/ds-react';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';

export const KopierbartNullableFødselsnummer: React.FC<{ fødselsnummer: string }> = ({
    fødselsnummer,
}) => {
    return (
        <HStack gap="space-2" align={'center'}>
            <BodyShortSmall>{formaterFødselsnummer(fødselsnummer)}</BodyShortSmall>
            <CopyButton
                size={'xsmall'}
                copyText={fødselsnummer}
                variant={'action'}
                activeText={'kopiert'}
            />
        </HStack>
    );
};
