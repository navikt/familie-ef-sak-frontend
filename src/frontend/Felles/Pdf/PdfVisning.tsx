import React, { useState } from 'react';
import { Ressurs } from '../../App/typer/ressurs';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import DataViewer from '../DataViewer/DataViewer';
import { AlertError } from '../Visningskomponenter/Alerts';
import { Loader, Pagination } from '@navikt/ds-react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// eslint-disable-next-line
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry.js');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfVisningProps {
    pdfFilInnhold: Ressurs<string>;
}

const StyledPagination = styled(Pagination)`
    margin: 0 auto;
`;

const StyledDokument = styled(Document)`
    .react-pdf__Page__canvas {
        box-shadow:
            0px 4px 4px rgba(0, 0, 0, 0.25),
            0px 0px 2px rgb(0 0 0 / 25%);
        margin: 0 auto;
    }

    margin: 0.5rem auto;
`;

const DokumentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0;
    min-width: 600px;

    align-self: flex-start;
    position: sticky;
    top: 100px;
    left: 0;
`;

const PdfVisning: React.FC<PdfVisningProps> = ({ pdfFilInnhold }) => {
    const [numPages, setNumPages] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        if (pageNumber > numPages) {
            setPageNumber(numPages);
        }
        setNumPages(numPages);
    }

    return (
        <DataViewer response={{ pdfFilInnhold }}>
            {({ pdfFilInnhold }) => (
                <DokumentWrapper>
                    <StyledPagination
                        page={pageNumber}
                        count={numPages}
                        onPageChange={setPageNumber}
                        size="xsmall"
                    />
                    <StyledDokument
                        file={`data:application/pdf;base64,${pdfFilInnhold}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={<AlertError children={'Ukjent feil ved henting av dokument.'} />}
                        noData={<AlertError children={'Dokumentet er tomt.'} />}
                        loading={
                            <Loader size={'xlarge'} variant="interaction" transparent={true} />
                        }
                    >
                        <Page pageNumber={pageNumber} renderTextLayer={true} />
                    </StyledDokument>
                    <StyledPagination
                        page={pageNumber}
                        count={numPages}
                        onPageChange={setPageNumber}
                        size="xsmall"
                    />
                </DokumentWrapper>
            )}
        </DataViewer>
    );
};

export default PdfVisning;
