import PdfVisning from '../../Felles/Pdf/PdfVisning';
import React, { useEffect } from 'react';
import { HentDokumentResponse } from '../../App/hooks/useHentDokument';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';

const FlexKnapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const JournalføringPdfVisning: React.FC<{ hentDokumentResponse: HentDokumentResponse }> = ({
    hentDokumentResponse,
}) => {
    const { hentFørsteDokument, hentForrigeDokument, hentNesteDokument, valgtDokument } =
        hentDokumentResponse;

    useEffect(() => {
        hentFørsteDokument();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <FlexKnapper>
                <Button type={'button'} variant={'secondary'} onClick={() => hentForrigeDokument()}>
                    Forrige Dokument
                </Button>
                <Button type={'button'} variant={'secondary'} onClick={() => hentNesteDokument()}>
                    Neste Dokument
                </Button>
            </FlexKnapper>
            <PdfVisning pdfFilInnhold={valgtDokument} />
        </>
    );
};

export default JournalføringPdfVisning;
