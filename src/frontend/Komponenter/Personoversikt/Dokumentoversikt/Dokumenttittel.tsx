import React, { Dispatch, SetStateAction } from 'react';
import { Button, HStack } from '@navikt/ds-react';
import { tittelMedUrlGodkjenteTegn } from '../../../App/utils/utils';
import { NotePencilIcon } from '@navikt/aksel-icons';
import { LogiskeVedlegg } from './LogiskeVedlegg';
import styled from 'styled-components';
import { Dokumentinfo } from '../../../App/typer/dokument';
import { ABlue500 } from '@navikt/ds-tokens/dist/tokens';

const Div = styled.div<{ $erHovedDokument: boolean }>`
    margin-left: ${(props) => (props.$erHovedDokument ? '0rem' : '2rem')};
`;

const standardFargeIkkeBesøktLenke = ABlue500;
const standardFargeBesøktLenke = 'purple';

const Tittel = styled.a<{ $harBlittBesøkt: boolean }>`
    color: ${(props) =>
        props.$harBlittBesøkt ? standardFargeBesøktLenke : standardFargeIkkeBesøktLenke};
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
    dokumentHarBlittBesøkt: boolean;
    oppdaterBesøkteDokumentLenker: () => void;
}

export const Dokumenttittel: React.FC<Props> = ({
    dokument,
    settValgtDokumentId,
    erHovedDokument,
    dokumentHarBlittBesøkt,
    oppdaterBesøkteDokumentLenker,
}) => (
    <HStack gap="2">
        <IkonKnapp
            icon={<NotePencilIcon title="Rediger" />}
            variant="tertiary"
            onClick={() => settValgtDokumentId(dokument.dokumentinfoId)}
        />
        <Div $erHovedDokument={erHovedDokument}>
            <Tittel
                $harBlittBesøkt={dokumentHarBlittBesøkt}
                href={`/dokument/journalpost/${dokument.journalpostId}/dokument-pdf/${dokument.dokumentinfoId}/${tittelMedUrlGodkjenteTegn(dokument.tittel)}`}
                target={'_blank'}
                rel={'noreferrer'}
                onClick={oppdaterBesøkteDokumentLenker}
                onAuxClick={(e) => {
                    if (e.button === 1) {
                        oppdaterBesøkteDokumentLenker();
                    }
                }}
                onContextMenu={() => {
                    oppdaterBesøkteDokumentLenker();
                }}
            >
                {dokument.tittel}
            </Tittel>
            <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
        </Div>
    </HStack>
);
