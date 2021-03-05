import React, { useState } from 'react';
import { Ressurs } from '../../typer/ressurs';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import styled from 'styled-components';
import { Page, Document, pdfjs } from 'react-pdf';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import Pagination from 'paginering';

pdfjs.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.js';

interface PdfVisningProps {
    pdfFilInnhold: Ressurs<string>;
}

const MidtstiltInnhold = styled.div`
    width: 50%;
    margin: 0 auto;
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
                <>
                    <MidtstiltInnhold>
                        <Pagination
                            numberOfItems={numPages}
                            onChange={setPageNumber}
                            itemsPerPage={1}
                            currentPage={pageNumber}
                        />
                    </MidtstiltInnhold>
                    <Document
                        file={`data:application/pdf;base64,${pdfFilInnhold}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={
                            <AlertStripeFeil children={'Ukjent feil ved henting av dokument.'} />
                        }
                        noData={<AlertStripeFeil children={'Dokumentet er tomt.'} />}
                        loading={<NavFrontendSpinner />}
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <MidtstiltInnhold>
                        <Pagination
                            numberOfItems={numPages}
                            onChange={setPageNumber}
                            itemsPerPage={1}
                            currentPage={pageNumber}
                        />
                    </MidtstiltInnhold>
                </>
            )}
        </DataViewer>
    );
};

export default PdfVisning;
