import React, { useEffect } from 'react';
import { HentDokumentResponse } from '../../App/hooks/useHentDokument';
import styled from 'styled-components';
import DataViewer from '../../Felles/DataViewer/DataViewer';

const Container = styled.div`
    flex: 1 1 auto;
`;

const JournalføringPdfVisning: React.FC<{ hentDokumentResponse: HentDokumentResponse }> = ({
    hentDokumentResponse,
}) => {
    const { hentFørsteDokument, valgtDokument } = hentDokumentResponse;

    useEffect(() => {
        hentFørsteDokument();
    }, [hentFørsteDokument]);

    return (
        <Container>
            <DataViewer response={{ valgtDokument }}>
                {({ valgtDokument }) => (
                    <iframe
                        title={'dokument'}
                        src={`data:application/pdf;base64,${valgtDokument}`}
                        width={'100%'}
                        height={'100%'}
                    />
                )}
            </DataViewer>
        </Container>
    );
};

export default JournalføringPdfVisning;
