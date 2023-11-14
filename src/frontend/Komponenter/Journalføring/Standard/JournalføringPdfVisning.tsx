import React, { useEffect, useMemo } from 'react';
import { HentDokumentResponse } from '../../../App/hooks/useHentDokument';
import styled from 'styled-components';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { base64toBlob } from '../../../App/utils/utils';

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

    const dokumentMemo = useMemo(() => {
        return (
            <DataViewer response={{ valgtDokument }}>
                {({ valgtDokument }) => {
                    const blob = base64toBlob(valgtDokument, 'application/pdf');
                    const pdfUrl = window.URL.createObjectURL(blob);

                    return (
                        <iframe title={'dokument'} src={pdfUrl} width={'100%'} height={'100%'} />
                    );
                }}
            </DataViewer>
        );
    }, [valgtDokument]);
    return <Container>{dokumentMemo}</Container>;
};

export default JournalføringPdfVisning;
