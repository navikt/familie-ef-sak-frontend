import React, { Dispatch, SetStateAction } from 'react';
import { Button, HStack } from '@navikt/ds-react';
import { tittelMedUrlGodkjenteTegn } from '../../../App/utils/utils';
import { NotePencilIcon } from '@navikt/aksel-icons';
import { LogiskeVedlegg } from './LogiskeVedlegg';
import styled from 'styled-components';
import { Dokumentinfo } from '../../../App/typer/dokumentliste';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

const Div = styled.div<{ $erHovedDokument: boolean }>`
    margin-left: ${(props) => (props.$erHovedDokument ? '0rem' : '2rem')};
`;

const Tittel = styled.a`
    &:visited {
        color: purple;
    }
`;

const IkonKnapp = styled(Button)`
    padding: 0;
    width: fit-content;
    height: fit-content;
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
}) => {
    const { toggles } = useToggles();
    const skalViseEndreTittelKnapp = toggles[ToggleName.visEndreDokumenttittelKnapp];

    return (
        <HStack gap="2">
            {skalViseEndreTittelKnapp && (
                <IkonKnapp
                    icon={<NotePencilIcon title="Rediger" />}
                    variant="tertiary"
                    onClick={() => settValgtDokumentId(dokument.dokumentinfoId)}
                />
            )}
            <Div $erHovedDokument={erHovedDokument}>
                <Tittel
                    href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}/${tittelMedUrlGodkjenteTegn(dokument.tittel)}`}
                    target={'_blank'}
                    rel={'noreferrer'}
                >
                    {dokument.tittel}
                </Tittel>
                <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
            </Div>
        </HStack>
    );
};
