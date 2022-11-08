import { Knapp } from 'nav-frontend-knapper';
import PdfVisning from '../../Felles/Pdf/PdfVisning';
import React, { useEffect } from 'react';
import { HentDokumentResponse } from '../../App/hooks/useHentDokument';
import styled from 'styled-components';

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
                <Knapp onClick={() => hentForrigeDokument()} mini>
                    Forrige Dokument
                </Knapp>
                <Knapp onClick={() => hentNesteDokument()} mini>
                    Neste Dokument
                </Knapp>
            </FlexKnapper>
            <PdfVisning pdfFilInnhold={valgtDokument} />
        </>
    );
};

export default JournalføringPdfVisning;
