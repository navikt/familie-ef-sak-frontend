import React, { useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { Document, Page } from 'react-pdf';

interface Props {
    behandlingId: string;
}

const StyledDiv = styled.div`
    display: flex;
    justify-content: center;
`;

const Brev: React.FC<Props> = () => {
    const { axiosRequest } = useApp();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());

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
        <>
            <StyledDiv>
                <Knapp onClick={genererBrev}>Generer brev</Knapp>
            </StyledDiv>
            <DataViewer response={brevRessurs}>
                {(data) => (
                    <>
                        <Document
                            file={`data:application/pdf;base64,${data}`}
                            error={
                                <AlertStripeFeil
                                    children={'Ukjent feil ved henting av dokument.'}
                                />
                            }
                            noData={<AlertStripeFeil children={'Dokumentet er tomt.'} />}
                            loading={<NavFrontendSpinner />}
                        >
                            <Page pageNumber={1} />
                            {/* TODO fiks pageNumber */}
                        </Document>
                    </>
                )}
            </DataViewer>
        </>
    );
};

export default Brev;
