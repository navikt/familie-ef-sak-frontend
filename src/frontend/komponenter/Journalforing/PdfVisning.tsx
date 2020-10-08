import React, { useState } from 'react';
import Paginering from '../Paginering/Paginering';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { Ressurs, RessursStatus } from '../../typer/ressurs';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import styled from 'styled-components';

interface PdfVisningProps {
    pdfFilInnhold: Ressurs<string>;
}

const MittStilltDiv = styled.div`
    width: 50%;
    margin: 0 auto;
`;

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
                <>
                    <MittStilltDiv>
                        <Paginering
                            sideStorrelse={1}
                            antallTotalt={numPages}
                            valgtSide={pageNumber}
                            settValgtSide={setPageNumber}
                        />
                    </MittStilltDiv>
                    <Document
                        file={`data:application/pdf;base64,${pdfFilInnhold.data}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={
                            <AlertStripeFeil children={'Ukjent feil ved henting av dokument.'} />
                        }
                        noData={<AlertStripeFeil children={'Dokumentet er tomt.'} />}
                        loading={<NavFrontendSpinner />}
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <MittStilltDiv>
                        <Paginering
                            sideStorrelse={1}
                            antallTotalt={numPages}
                            valgtSide={pageNumber}
                            settValgtSide={setPageNumber}
                        />
                    </MittStilltDiv>
                </>
            );
    }
};

export default PdfVisning;
