import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { OrNothing } from '../../hooks/useSorteringState';

const PdfVisning: React.FC = () => {
    const [numPages, setNumPages] = useState<OrNothing<number>>(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }
    return (
        <div>
            <Document file="somefile.pdf" onLoadSuccess={onDocumentLoadSuccess}>
                <Page pageNumber={pageNumber} />
            </Document>
            <p>
                Page {pageNumber} of {numPages}
            </p>
        </div>
    );
};

export default PdfVisning;
