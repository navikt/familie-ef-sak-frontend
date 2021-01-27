import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Page } from 'react-pdf';
import {
    StyledBrev,
    GenererBrev,
    StyledDataViewer,
    DokumentWrapper,
    StyledPagination,
    StyledDokument,
} from './Elementer';

interface Props {
    behandlingId: string;
}

const Brev: React.FC<Props> = () => {
    const { axiosRequest } = useApp();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState<number>(0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const data = { tittel: 'test' };

    const genererBrev = () => {
        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/lag-brev`,
            data: data,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    return (
        <StyledBrev>
            <GenererBrev onClick={genererBrev}>Generer brev</GenererBrev>
            <StyledDataViewer response={brevRessurs}>
                {(data) => (
                    <DokumentWrapper>
                        <StyledPagination
                            numberOfItems={numPages}
                            onChange={setPageNumber}
                            itemsPerPage={1}
                            currentPage={pageNumber}
                        />
                        <StyledDokument
                            file={`data:application/pdf;base64,${data}`}
                            onLoadSuccess={onDocumentLoadSuccess}
                            error={
                                <AlertStripeFeil
                                    children={'Ukjent feil ved henting av dokument.'}
                                />
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
            </StyledDataViewer>
        </StyledBrev>
    );
};

export default Brev;
