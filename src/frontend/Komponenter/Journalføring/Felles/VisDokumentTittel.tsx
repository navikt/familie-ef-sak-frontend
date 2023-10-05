import React from 'react';
import styled from 'styled-components';
import { ILogiskVedlegg } from '../../../App/typer/dokumentliste';
import { BodyShort, Button, Label, Link } from '@navikt/ds-react';
import { PencilFillIcon, ExternalLinkIcon, FileTextIcon } from '@navikt/aksel-icons';
import { åpneFilIEgenTab } from '../../../App/utils/utils';
import { DokumentInfo } from '../../../App/typer/journalføring';

const IkonKnapp = styled(Button)`
    margin-right: 0.5rem;
`;

const DokumentRad = styled.div`
    display: flex;
    justify-content: space-between;
    word-break: break-word;
`;

const LogiskeVedlegg = styled.div`
    padding-left: 0.5rem;
`;

const DokumentTittel = styled.div`
    display: flex;
    align-items: center;
`;

interface VisDokumentTittelProps {
    journalPostId: string;
    dokumentInfo: DokumentInfo;
    settDokumentForRedigering: () => void;
    hentDokument: () => void;
    dokumentTittel?: string;
    logiskeVedlegg: ILogiskVedlegg[];
}

const VisDokumentTittel: React.FC<VisDokumentTittelProps> = ({
    journalPostId,
    dokumentInfo,
    dokumentTittel,
    hentDokument,
    settDokumentForRedigering,
    logiskeVedlegg,
}) => {
    const tittel = dokumentTittel ? dokumentTittel : 'Ukjent';

    return (
        <>
            <DokumentRad>
                <DokumentTittel>
                    <Label as={'p'}>
                        <Link onClick={hentDokument} href={'#'}>
                            {dokumentTittel ? dokumentTittel : 'Ukjent'}
                        </Link>
                    </Label>
                    <Button
                        type={'button'}
                        variant={'tertiary'}
                        size={'small'}
                        icon={<ExternalLinkIcon aria-hidden />}
                        onClick={() =>
                            åpneFilIEgenTab(journalPostId, dokumentInfo.dokumentInfoId, tittel)
                        }
                    />
                </DokumentTittel>
                <div>
                    <IkonKnapp
                        type="button"
                        variant={'tertiary'}
                        size={'small'}
                        icon={<PencilFillIcon />}
                        onClick={settDokumentForRedigering}
                    />
                    <IkonKnapp
                        type="button"
                        variant={'tertiary'}
                        size={'small'}
                        icon={<FileTextIcon />}
                        onClick={hentDokument}
                    />
                </div>
            </DokumentRad>
            {logiskeVedlegg.length > 0 && (
                <LogiskeVedlegg>
                    {logiskeVedlegg.map((vedlegg) => (
                        <BodyShort size="small">{vedlegg.tittel}</BodyShort>
                    ))}
                </LogiskeVedlegg>
            )}
        </>
    );
};

export default VisDokumentTittel;
