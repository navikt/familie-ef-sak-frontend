import React, { useEffect } from 'react';
import { HentDokumentResponse } from '../../App/hooks/useHentDokument';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';
import IframeDokument from './IframeDokument';

const FlexKnapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Wrapper = styled.div`
    flex: 1 1 auto;
`;

const JournalføringPdfVisning: React.FC<{ hentDokumentResponse: HentDokumentResponse }> = ({
    hentDokumentResponse,
}) => {
    const { hentFørsteDokument, hentForrigeDokument, hentNesteDokument, valgtDokument } =
        hentDokumentResponse;

    useEffect(() => {
        hentFørsteDokument();
        // eslint-disable-next-line
    }, []);

    return (
        <Wrapper>
            {/*<FlexKnapper>*/}
            {/*    <Button type={'button'} variant={'secondary'} onClick={() => hentForrigeDokument()}>*/}
            {/*        Forrige Dokument*/}
            {/*    </Button>*/}
            {/*    <Button type={'button'} variant={'secondary'} onClick={() => hentNesteDokument()}>*/}
            {/*        Neste Dokument*/}
            {/*    </Button>*/}
            {/*</FlexKnapper>*/}
            <IframeDokument pdfFilInnhold={valgtDokument}></IframeDokument>
        </Wrapper>
    );
};

export default JournalføringPdfVisning;
