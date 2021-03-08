import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Page } from 'react-pdf';
import {
    StyledBrev,
    GenererBrev,
    DokumentWrapper,
    StyledPagination,
    StyledDokument,
    HentBrev,
} from './Elementer';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import BrevFooter from './BrevFooter';

interface Props {
    behandlingId: string;
}

const Brev: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();

    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState<number>(0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const data = { navn: 'test', ident: '123456789' };

    const genererBrev = () => {
        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
            data: data,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    const hentBrev = () => {
        axiosRequest<string, any>({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    return (
        <>
            <StyledBrev>
                <GenererBrev onClick={genererBrev}>Generer brev</GenererBrev>
                <HentBrev onClick={hentBrev}>Hent brev</HentBrev>
                <DataViewer response={{ brevRessurs }}>
                    {({ brevRessurs }) => (
                        <DokumentWrapper>
                            <StyledPagination
                                numberOfItems={numPages}
                                onChange={setPageNumber}
                                itemsPerPage={1}
                                currentPage={pageNumber}
                            />
                            <StyledDokument
                                file={`data:application/pdf;base64,${brevRessurs}`}
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
            </StyledBrev>
            <BrevFooter behandlingId={behandlingId} />
        </>
    );
};

export default Brev;
