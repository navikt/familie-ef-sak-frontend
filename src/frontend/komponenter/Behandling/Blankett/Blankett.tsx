import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Page } from 'react-pdf';
import {
    DokumentWrapper,
    GenererBlankett,
    HentBlankett,
    StyledBlankett,
    StyledDokument,
    StyledPagination,
} from './Elementer';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import BlankettFooter from './BlankettFooter';

interface Props {
    behandlingId: string;
}

const Blankett: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();

    const [blankettRessurs, settBlankettRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState<number>(0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const data = { navn: 'test', ident: '123456789' };

    const genererBlankett = () => {
        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/blankett/${behandlingId}`,
            data: data,
        }).then((respons: Ressurs<string>) => {
            settBlankettRessurs(respons);
        });
    };

    const hentBlankett = () => {
        axiosRequest<string, any>({
            method: 'GET',
            url: `/familie-ef-sak/api/hentBlankett/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBlankettRessurs(respons);
        });
    };

    return (
        <>
            <StyledBlankett>
                <GenererBlankett onClick={genererBlankett}>Generer brev</GenererBlankett>
                <HentBlankett onClick={hentBlankett}>Hent brev</HentBlankett>
                <DataViewer response={blankettRessurs}>
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
                </DataViewer>
            </StyledBlankett>
            <BlankettFooter behandlingId={behandlingId} />
        </>
    );
};

export default Blankett;
