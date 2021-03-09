import React, { useState } from 'react';
import { Ressurs } from '../../typer/ressurs';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import DataViewer from './DataViewer/DataViewer';
import Pagination from 'paginering';

pdfjs.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.js';

interface PdfVisningProps {
    pdfFilInnhold: Ressurs<string>;
}

const StyledPagination = styled(Pagination)`
    margin: 0 auto;
`;

const StyledDokument = styled(Document)`
    .react-pdf__Page__canvas {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 0px 2px rgb(0 0 0 / 25%);
        margin: 0 auto;
    }
    margin: 0.5rem auto;
`;

const DokumentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0.5rem 0;
`;

const PdfVisning: React.FC<PdfVisningProps> = ({ pdfFilInnhold }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <DataViewer response={{ pdfFilInnhold }}>
            {({ pdfFilInnhold }) => (
                <DokumentWrapper>
                    <StyledPagination
                        numberOfItems={numPages}
                        onChange={setPageNumber}
                        itemsPerPage={1}
                        currentPage={pageNumber}
                    />
                    <StyledDokument
                        file={`data:application/pdf;base64,${pdfFilInnhold}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={
                            <AlertStripeFeil children={'Ukjent feil ved henting av dokument.'} />
                        }
                        noData={<AlertStripeFeil children={'Dokumentet er tomt.'} />}
                        loading={<NavFrontendSpinner />}
                    >
                        <Page pageNumber={pageNumber} />
                    </StyledDokument>
                    <StyledPagination
                        numberOfItems={numPages}
                        onChange={setPageNumber}
                        itemsPerPage={1}
                        currentPage={pageNumber}
                    />
                </DokumentWrapper>
            )}
        </DataViewer>
    );
};

export default PdfVisning;
