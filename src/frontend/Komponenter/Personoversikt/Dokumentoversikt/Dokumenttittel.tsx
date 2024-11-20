import React, { Dispatch, SetStateAction } from 'react';
import { Button, HStack } from '@navikt/ds-react';
import { tittelMedUrlGodkjenteTegn } from '../../../App/utils/utils';
import { NotePencilIcon } from '@navikt/aksel-icons';
import { LogiskeVedlegg } from './LogiskeVedlegg';
import styled from 'styled-components';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';

const LenkeVenstreMargin = styled.a<{ $erHovedDokument: boolean }>`
    margin-left: ${(props) => (props.$erHovedDokument ? '0rem' : '2rem')};

    &:visited {
        color: purple;
    }
`;

const Container = styled.div`
    max-width: 32rem;
`;

const IkonKnapp = styled(Button)`
    padding: 0;
`;

interface Props {
    dokument: Dokumentinfo;
    settValgtDokumentId: Dispatch<SetStateAction<string>>;
    erHovedDokument: boolean;
}

export const Dokumenttittel: React.FC<Props> = ({
    dokument,
    settValgtDokumentId,
    erHovedDokument,
}) => (
    <Container>
        <HStack gap="2" justify="space-between">
            <LenkeVenstreMargin
                href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}/${tittelMedUrlGodkjenteTegn(dokument.tittel)}`}
                target={'_blank'}
                rel={'noreferrer'}
                $erHovedDokument={erHovedDokument}
            >
                {dokument.tittel}
            </LenkeVenstreMargin>
            <IkonKnapp
                icon={<NotePencilIcon title="Rediger" />}
                variant="tertiary"
                onClick={() => settValgtDokumentId(dokument.dokumentinfoId)}
            />
        </HStack>
        <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
    </Container>
);
