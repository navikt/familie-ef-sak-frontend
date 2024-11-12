import React from 'react';
import { Button, HStack } from '@navikt/ds-react';
import { tittelMedUrlGodkjenteTegn } from '../../../App/utils/utils';
import { NotePencilIcon } from '@navikt/aksel-icons';
import { LogiskeVedlegg } from './LogiskeVedlegg';
import styled from 'styled-components';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';

const LenkeVenstreMargin = styled.a`
    margin-left: 2rem;

    &:visited {
        color: purple;
    }
`;

const IkonKnapp = styled(Button)`
    padding: 0;
`;

interface Props {
    dokument: Dokumentinfo;
}

export const Dokumenttittel: React.FC<Props> = ({ dokument }) => (
    <>
        <HStack gap="2" justify="space-between">
            <LenkeVenstreMargin
                href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}/${tittelMedUrlGodkjenteTegn(dokument.tittel)}`}
                target={'_blank'}
                rel={'noreferrer'}
            >
                {dokument.tittel}
            </LenkeVenstreMargin>
            <IkonKnapp icon={<NotePencilIcon title="Rediger" />} variant="tertiary" />
        </HStack>
        <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
    </>
);
