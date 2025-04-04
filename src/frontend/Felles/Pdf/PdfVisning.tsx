import React, { useState } from 'react';
import { Ressurs } from '../../App/typer/ressurs';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import DataViewer from '../DataViewer/DataViewer';
import { AlertError } from '../Visningskomponenter/Alerts';
import { Loader, Pagination } from '@navikt/ds-react';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface PdfVisningProps {
    pdfFilInnhold: Ressurs<string>;
}

const StyledDokument = styled(Document)`
    .react-pdf__Page__canvas {
        box-shadow:
            0px 4px 4px rgba(0, 0, 0, 0.25),
            0px 0px 2px rgb(0 0 0 / 25%);
        margin: 0 auto;
    }
`;

const PdfVisning: React.FC<PdfVisningProps> = ({ pdfFilInnhold }) => {
    const [antallSider, setAntallSider] = useState(1);
    const [sidenummer, setSidenummer] = useState(1);

    const skalVisePaginering = antallSider > 1;

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        if (sidenummer > numPages) {
            setSidenummer(numPages);
        }
        setAntallSider(numPages);
    };

    return (
        <DataViewer response={{ pdfFilInnhold }}>
            {({ pdfFilInnhold }) => (
                <>
                    {skalVisePaginering && (
                        <Pagination
                            page={sidenummer}
                            count={antallSider}
                            onPageChange={setSidenummer}
                            size="xsmall"
                        />
                    )}
                    <StyledDokument
                        key={new Date().getTime().toString()}
                        file={`data:application/pdf;base64,${pdfFilInnhold}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={<AlertError>Ukjent feil ved henting av dokument</AlertError>}
                        noData={<AlertError>Dokumentet er tomt</AlertError>}
                        loading={
                            <Loader size={'xlarge'} variant="interaction" transparent={true} />
                        }
                    >
                        <Page pageNumber={sidenummer} renderTextLayer={true} />
                    </StyledDokument>
                    {skalVisePaginering && (
                        <Pagination
                            page={sidenummer}
                            count={antallSider}
                            onPageChange={setSidenummer}
                            size="xsmall"
                        />
                    )}
                </>
            )}
        </DataViewer>
    );
};

export default PdfVisning;
