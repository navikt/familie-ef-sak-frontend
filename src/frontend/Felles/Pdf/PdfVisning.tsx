import React, { Dispatch, SetStateAction, useState } from 'react';
import { Ressurs } from '../../App/typer/ressurs';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import DataViewer from '../DataViewer/DataViewer';
import { AlertError } from '../Visningskomponenter/Alerts';
import { Loader, Pagination } from '@navikt/ds-react';
import 'react-pdf/src/Page/TextLayer.css';
import 'react-pdf/src/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface Props {
    pdfFilInnhold: Ressurs<string>;
    erDokumentInnlastet: boolean;
    settErDokumentInnlastet: Dispatch<SetStateAction<boolean>>;
}

const StyledDokument = styled(Document)`
    width: fit-content;
    margin: 0 auto;

    box-shadow:
        0px 4px 4px rgba(0, 0, 0, 0.25),
        0px 0px 2px rgb(0 0 0 / 25%);
`;

const PdfVisning: React.FC<Props> = ({
    pdfFilInnhold,
    erDokumentInnlastet,
    settErDokumentInnlastet,
}) => {
    const [antallSider, settAntallSider] = useState(1);
    const [sidenummer, settSidenummer] = useState(1);

    const skalVisePaginering = antallSider > 1;

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        if (sidenummer > numPages) {
            settSidenummer(numPages);
        }
        settAntallSider(numPages);
        settErDokumentInnlastet(true);
    };

    return (
        <DataViewer response={{ pdfFilInnhold }}>
            {({ pdfFilInnhold }) => (
                <>
                    {skalVisePaginering && (
                        <Pagination
                            page={sidenummer}
                            count={antallSider}
                            onPageChange={settSidenummer}
                            size="xsmall"
                        />
                    )}
                    <StyledDokument
                        key={this}
                        file={`data:application/pdf;base64,${pdfFilInnhold}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={<AlertError>Ukjent feil ved henting av dokument</AlertError>}
                        noData={<AlertError>Dokumentet er tomt</AlertError>}
                        loading={
                            <Loader size={'xlarge'} variant="interaction" transparent={true} />
                        }
                    >
                        {erDokumentInnlastet && (
                            <Page pageNumber={sidenummer} renderTextLayer={true} />
                        )}
                    </StyledDokument>
                    {skalVisePaginering && (
                        <Pagination
                            page={sidenummer}
                            count={antallSider}
                            onPageChange={settSidenummer}
                            size="xsmall"
                        />
                    )}
                </>
            )}
        </DataViewer>
    );
};

export default PdfVisning;
