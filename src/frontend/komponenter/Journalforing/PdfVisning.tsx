import React, { useState } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
import Paginering from '../Paginering/Paginering';
// @ts-ignore
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { Ressurs, RessursStatus } from '../../typer/ressurs';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';

interface PdfVisningProps {
    pdfFilInnhold: Ressurs<string>;
}

const PdfVisning: React.FC<PdfVisningProps> = ({ pdfFilInnhold }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    switch (pdfFilInnhold.status) {
        case RessursStatus.IKKE_HENTET:
            return null;
        case RessursStatus.FEILET:
            return <AlertStripeFeil>Noe gikk galt ved lasting av dokument</AlertStripeFeil>;
        case RessursStatus.IKKE_TILGANG:
            return <AlertStripeFeil>Du har ikke tilgang til dette dokumentet</AlertStripeFeil>;
        case RessursStatus.HENTER:
            return <NavFrontendSpinner />;
        case RessursStatus.SUKSESS:
            return (
                <div>
                    <p>
                        <Paginering
                            sideStorrelse={1}
                            antallTotalt={numPages}
                            valgtSide={pageNumber}
                            settValgtSide={setPageNumber}
                        />
                    </p>
                    <Document
                        file={
                            pdfFilInnhold.status === RessursStatus.SUKSESS
                                ? `data:application/pdf;base64,${pdfFilInnhold.data}`
                                : undefined
                        }
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={
                            <AlertStripeFeil children={'Ukjent feil ved henting av dokument.'} />
                        }
                        noData={<AlertStripeFeil children={'Dokumentet er tomt.'} />}
                        loading={<NavFrontendSpinner />}
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <p>
                        <Paginering
                            sideStorrelse={1}
                            antallTotalt={numPages}
                            valgtSide={pageNumber}
                            settValgtSide={setPageNumber}
                        />
                    </p>
                </div>
            );
    }
};

export default PdfVisning;
